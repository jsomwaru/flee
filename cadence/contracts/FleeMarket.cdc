import FleeNFT from 0x01cf0e2f2f715450
import FlowToken from  0x0ae53cb6e3f42a79
import FungibleToken from  0xee82856bf20e2aa6
import NonFungibleToken from 0x01cf0e2f2f715450


pub contract FleeMarket {

    pub event ItemUnlisted(listingId: UInt64)

    pub event ItemListed(listingId: UInt64)

    pub event ItemSold(listingId: UInt64, price: UFix64) 

    // ------ INTERFACES ------
    // Public view of listing
    pub resource interface Window {
        pub let saleCompleted: Bool
        pub let listingId: UInt64
        pub let itemId: UInt64
        pub let price: UFix64
        pub let _owner: Address
    }

    // Public interface to List Flee tokens for sale
    pub resource interface FleeLister {
        pub fun list(id: UInt64, listingId: UInt64, owneraddr: Address, price: UFix64) 
        pub fun unlist(listingId: UInt64): @Listing
    }

    pub resource interface CollectionPublic {
        pub fun getListingIds():[UInt64]
    }

    // This is public Function anybody should be able to call
    // May not need it in a resource
    pub resource interface Purchaser {
        pub fun purchase(listingId: UInt64, 
                        vault: @FungibleToken.Vault, 
                        buyercollection: &NonFungibleToken.Collection{NonFungibleToken.Receiver})
    }
    // --------------------------
    // ------- RESOURCES --------
    pub resource Listing: Window  {

        pub let listingId: UInt64      
        pub let itemId: UInt64
        pub let _owner: Address 
        pub let price: UFix64
        pub let saleCompleted: Bool

        init(id: UInt64, listingId: UInt64, addr: Address, price: UFix64) { 
            self.listingId  = listingId
            self.itemId = id
            self._owner = addr    
            self.price  = price   
            self.saleCompleted = false 
        }
    }

    pub resource Collection: CollectionPublic, FleeLister, Purchaser {

        pub var itemsListed: @{UInt64: Listing}

        init() {
            self.itemsListed <- {}
        }

        destroy () {
            destroy self.itemsListed
        }

        pub fun getListingIds():[UInt64] {
            return self.itemsListed.keys
        }


        pub fun unlist(listingId: UInt64): @Listing  {
            return <- (self.itemsListed.remove(key: listingId) ?? panic("Listing not found"))
        }
        
        pub fun list(id: UInt64, listingId: UInt64, owneraddr: Address, price: UFix64) {
            // Create a  listing
            let collection = getAccount(owneraddr)
                        .getCapability(/public/fleeCollectionPublic)!
                        .borrow<&FleeNFT.Collection{FleeNFT.FleeCollectionPublic}>()
                        ?? panic("Could not get collection")

            let flee = collection.borrowFlee(id: id)
            let metadata = flee!.borrowMeta()
            let listing <- create Listing(id: id, listingId: listingId, addr: owneraddr, price: price) 
            self.itemsListed[listingId] <-! listing
        }

        pub fun purchase(listingId: UInt64, 
                         vault: @FungibleToken.Vault, 
                         buyercollection: &NonFungibleToken.Collection{NonFungibleToken.Receiver})
        { 
            pre {
                self.itemsListed[listingId] != nil: "Item does not exists"
            }

            let listing = self.borrowListing(listingId)

            if listing! == nil || vault.balance < listing!.price {
                panic("Funds Short \n")
            }

            let seller = getAccount(listing!._owner)

            let ownervault = seller
                            .getCapability(/public/receiver)!
                            .borrow<&FungibleToken.Vault{FungibleToken.Receiver}>()
            
            // deposit $$ in NFT owner vault from the buyer
            // I will alway have to authorize this transaction right?
            ownervault!.deposit(from: <- vault)

            let prov = seller.getCapability(/public/provider)!
                            .borrow<&NonFungibleToken.Collection{NonFungibleToken.Provider}>()

            let token <- prov!.withdraw(tokenId: listing!.itemId)

            buyercollection.deposit(token: <- token)

            let oldlisting <- self.unlist(listingId: listingId)
            emit ItemSold(listingId: listingId, price: listing!.price)
            destroy oldlisting

         }

        pub fun borrowListing(_ id: UInt64): &Listing{Window}? {
            if self.itemsListed[id] != nil  {
                return &self.itemsListed[id] as &Listing{Window}
            }
            return nil
        }

        pub fun createSalesCollection(): @Collection {
            return <-create Collection()
        }
    }

    init() {
        self.account.save(<- create Collection(), to: /storage/FleeItemsListed )
    }

}