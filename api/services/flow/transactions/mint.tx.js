const mintTokens = `
import FleeNFT from 0xf8d6e0586b0a20c7
import FleeMarket from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7

transaction (quantity: Int, fileMeta: {String: String}, reciever: Address) {
    let reciever: Address
    let minter: &FleeNFT.Minter

    prepare(signer: AuthAccount) {

        self.reciever = reciever

        self.minter = signer.borrow<&FleeNFT.Minter>(from: /storage/minter)!
    }

    execute {
        
        let collection = getAccount(self.reciever).getCapability(/public/FleeCollectionPublic)!
                         .borrow<&FleeNFT.Collection{FleeNFT.FleeCollectionPublic}>()
                         ?? panic("Could not borrow collection")

        log(collection)
        // self.minter.mint(recipient: collection!, formData: fileMeta)

        let tokens <- self.minter.mintTokens(quantity: quantity, metadata: fileMeta)
        
        for i in tokens.getIds() {
            let token <- tokens.withdraw(tokenId: i)
            collection!.deposit(token: <-token )
        }

        destroy tokens
    }
    
}
`
exports.mintTokens = mintTokens;

