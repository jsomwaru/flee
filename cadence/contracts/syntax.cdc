import FleeNFT from "./FleeNFT.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
        transaction {
            let  addr: Address
            prepare(account: AuthAccount) {
                self.addr = account.address 
                if account.borrow<&NonFungibleToken.Collection>(from: /public/FleeCollection) == nil {
                    let collection  <- FleeNFT.createEmptyCollection() as!@FleeNFT.Collection
                    account.save<@FleeNFT.Collection>(<-collection, to: /storage/FleeCollection) 
                    account.link<&FleeNFT.Collection{NonFungibleToken.CollectionPublic, FleeNFT.FleeCollectionPublic}>(/public/FleeCollectionPublic, target: /storage/FleeCollection)
                }
            }
        }