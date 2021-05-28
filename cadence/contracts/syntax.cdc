import FleeNFT from 0xf8d6e0586b0a20c7
import FleeMarket from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7

transaction  {
    let reciever: Address
    let minter: &FleeNFT.Minter

    prepare(signer: AuthAccount) {

        self.reciever = 0xf8d6e0586b0a20c7

        self.minter = signer.borrow<&FleeNFT.Minter>(from: /storage/minter)!
    }

    execute {
        let meta = {
            "ac": "bd"
        }

        let collection = getAccount(self.reciever).getCapability(/public/FleeCollectionPublic)!.borrow<&FleeNFT.Collection{FleeNFT.FleeCollectionPublic}>()
        let tokens <- self.minter.mintTokens(quantity: 1, metadata: meta)
        for i in tokens.ownedTokens.keys {
            let token <- tokens.withdraw(tokenId: i)
            collection!.deposit(token: <-token )
        }
        destroy tokens
    }
    
}
