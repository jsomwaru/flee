import NonFungibleToken from  0xf8d6e0586b0a20c7

pub contract FleeNFT: NonFungibleToken {
    
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
    
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        
        pub var ownedTokens: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedTokens <- {}
        }

        destroy () {
            // idk should i
            destroy self.ownedTokens
        }

        pub fun withdraw(tokenId: UInt64): @NonFungibleToken.NFT{
            let token <- self.ownedTokens.remove(key: tokenId)!
            return <- token
        }
        
        pub fun deposit(token: @NonFungibleToken.NFT){
            self.ownedTokens[token.id] <-! token
        }

        pub fun getIds(): [UInt64] {
            return self.ownedTokens.keys
        }

        pub fun checkId(id: UInt64): Bool {
            return self.ownedTokens[id] != nil
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedTokens[id] as &NonFungibleToken.NFT
        }

    }

    pub resource Minter {
        pub fun mint(recipient: &{NonFungibleToken.CollectionPublic}, formData: {String:String}) {
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
        .borrow<&FleeNFT.Collection{NonFungibleToken.CollectionPublic}>()
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
        self.account.link<&FleeNFT.Collection{NonFungibleToken.CollectionPublic}>(/public/FleeCollectionPublic, target: /storage/FleeCollection)

        emit ContractInitialized()
    }

}
 