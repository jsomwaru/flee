const fcl = require('@onflow/fcl')
const types = require('@onflow/types')
const mintTx = require("../services/flow/transactions/mint.tx")

class MarketService {
    
    constructor(flow) {
        this.flow = flow
    }
    
    async mint(quantity, filemeta, address) {
        let auth = this.flow.authorizeAccount()
        console.log(filemeta)
        const tx = await fcl.send([fcl.transaction(mintTx.mintTokens), 
            fcl.args([fcl.arg(quantity, types.Int),
            fcl.arg(filemeta, types.Dictionary({key: types.String, value: types.String})),
            fcl.arg(address, types.Address)]),
            fcl.payer(auth),
            fcl.authorizations([auth]),
            fcl.proposer(auth),
            fcl.limit(9999)])    
        return fcl.tx(tx).onceSealed()
    }

}

exports.MarketService = MarketService;