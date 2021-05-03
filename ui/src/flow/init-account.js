import * as fcl from "@onflow/fcl"

// User  calles the flee nft contract address 
export async function initAccount(auth) {
    let tx  = await fcl.send([fcl.transaction`
    import FleeNFT from 0xFLEENFT
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
        `, fcl.payer(fcl.authz), fcl.authorizations([fcl.authz]),fcl.proposer(fcl.authz), fcl.limit(35)] ).then(fcl.decode)
    return fcl.tx(tx).onceSealed()
}


