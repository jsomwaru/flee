import FleeNFT from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7
        transaction {
            prepare(account: AuthAccount) {
                if account.borrow<&NonFungibleToken.Collection>(from: /storage/FleeCollection) == nil {
                    let collection  <- FleeNFT.createEmptyCollection() as! @FleeNFT.Collection
                    account.save<@FleeNFT.Collection>(<-collection, to: /storage/FleeCollection) 
                    account.link<&FleeNFT.Collection{NonFungibleToken.CollectionPublic, FleeNFT.FleeCollectionPublic}>(/public/FleeCollectionPublic, target: /storage/FleeCollection)
                }
            }
        }