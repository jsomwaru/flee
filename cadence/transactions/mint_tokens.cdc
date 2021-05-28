 import FleeNFT from 0xf8d6e0586b0a20c7

transaction(recipient: Address, metadata: {String: String} ) {
    let minter: &FleeNFT.Minter

    prepare (signer: AuthAccount) {
        self.minter = signer.borrow<&FleeNFT.Minter>(from: /storage/minter)
        ?? panic ("Could Not borrow refernce to Minter")
    }

    pre {
        metadata.keys.length != 0 :
        panic("Missing important data tbd")
    }

    execute {
        
        let recipient = getAccount(0x01cf0e2f2f715450)
        let collection = recipient.getCapability(/public/FleeCollectionPublic)!.borrow<&FleeNFT.Collection{FleeNFT.FleeCollectionPublic}>()
        self.minter.mint(recipient: collection, formData: metadata)
    }
}
 