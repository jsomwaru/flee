const mintTokens = `
import FleeNFT from 0xSERVICE
import FLeeMarket from 0xSERVICE
import NonFungibleToken from 0xSERVICE

transaction (price: UInt64, qunatity: UInt, name: String, fileMeta: String, reciever: Address) {
    let reciever: Address

    prepare(signer: AuthAccount) {
        var tokens: [@FleeNFTs]

        self.reciever = reciever 

        let minter <- signer.load<@FleeNFT.Minter>(from: /strorage/minter)

        let recipent <- singer2.getCapability<&NonFungibleToken{NonFungibleToken.Reciver}>(/public/FleeReciever)

        for token in quantity {

        }
    }

    execute {
        let acct = getAccount(self.reciver)
        let fleeReciever = acct.getCapability<&NonFungibleToken{NonFungibleToken.Reciever}>(/public/FleeReviver)
        fleeReciever.deposit()
    }
    
}
`