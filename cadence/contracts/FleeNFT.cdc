import NonFungibleToken from  0x01cf0e2f2f715450
pub contract FleeNFT: NonFungibleToken {
    
    pub event Deposited(tokenid: UInt64, to: Address?)
    
    // Main NonFungibleToken.NFT
    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        access(self) let metadata: {String: String}

        init (id: UInt64, metadata: {String: String}) {
            self.id = id
            self.metadata = metadata
        }

        pub fun borrowMeta(): &{String:String} {
            return &self.metadata as &{String:String}
        }
    }
    
    pub resource interface FleeCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIds(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowFlee(id: UInt64): &FleeNFT.NFT?
    }


    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, FleeCollectionPublic {
        
        pub var ownedTokens: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedTokens <- {}
        }

        destroy () {
            destroy self.ownedTokens
        }

        pub fun withdraw(tokenId: UInt64): @NonFungibleToken.NFT{
            let token <- self.ownedTokens.remove(key: tokenId)!
            return <- token
        }
        
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @FleeNFT.NFT
            let id: UInt64 = token.id
            let oldToken <- self.ownedTokens[token.id] <-! token
            emit Deposited(tokenid: id, to: self.owner?.address)
            destroy oldToken
        }

        pub fun getIds(): [UInt64] {
            return self.ownedTokens.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedTokens[id] as &NonFungibleToken.NFT
        }

        pub fun borrowFlee(id: UInt64): &FleeNFT.NFT? {
            if self.ownedTokens[id] != nil  {
                let item = &self.ownedTokens[id] as auth &NonFungibleToken.NFT
                return item as! &FleeNFT.NFT
            }
            return nil
        }
    }   


    pub resource Minter {
        pub fun mint(recipient: &{FleeCollectionPublic}, formData: {String:String}) {
            emit Minted(id: FleeNFT.supply, metadata: formData)

            recipient.deposit(token: <-create NFT(id: FleeNFT.supply, metadata: formData))
            
            FleeNFT.supply = FleeNFT.supply + 1 as UInt64
        }
    }


    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun fetch(_ from: Address, id: UInt64): &NonFungibleToken.NFT? {
        let collection =  getAccount(from)
        .getCapability(/public/FleeCollectionPublic)!
        .borrow<&FleeNFT.Collection{FleeCollectionPublic}>()
        ?? panic("Could not get collection")

        return collection.borrowNFT(id: id)
    }

    access(contract) var supply: UInt64
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, metadata:{String:String})

    // pub let collectionPath: PublicPath
    // pub let storagePath: StoragePath

    init() {

        self.supply = 1
        // self.collectionPath = /public/FleeCollectionPublic
        // self.storagePath = /storage/FleeCollection

        let collection <- FleeNFT.createEmptyCollection()


        self.account.save(<-create Minter(), to: /storage/minter)
        self.account.save(<-collection,      to: /storage/collection)
        
        self.account.link<&Minter>(/private/minter, target: /storage/minter)
        self.account.link<&FleeNFT.Collection{FleeCollectionPublic}>(/public/FleeCollectionPublic, target: /storage/FleeCollection)

        emit ContractInitialized()
    }

}
 