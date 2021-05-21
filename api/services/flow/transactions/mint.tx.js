const mintTokens = `
import FleeNFT from 0xSERVICE
import FLeeMarket from 0xSERVICE
import NonFungibleToken from 0xSERVICE

transaction (qunatity: UInt, fileMeta: {String: String}, reciever: Address) {
    let reciever: Address
    let minter: &FleeNFT.Minter

    prepare(signer: AuthAccount) {

        self.reciever = reciever

        self.minter = signer.borrow<&FleeNFT.Minter>(from: /strorage/minter)
    }

    execute {
        
        let collection = getAccount(self.recipient).getCapability(/public/FleeCollectionPublic)!.borrow<&FleeNFT.Collection{FleeNFT.FleeCollectionPublic}>()
        
        let tokens <- self.minter.mintTokens(quantity: quantity, metadata: fileMeta)

        for i in tokens {
            collection.deposit(token: i)
        }
    }
    
}
`

exports.mintTokens = mintTokens;