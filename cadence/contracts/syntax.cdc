import FleeNFT from "./FleeNFT.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"

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
