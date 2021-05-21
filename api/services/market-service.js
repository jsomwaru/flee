const fcl = require('@onflow/fcl')
const types = require('@onflow/types')
const mintTx = require("../services/flow/transactions/mint.tx")

class MarketService {
    
    constructor(flow) {
        this.flow = flow
    }
    
    async mint(quantity, filemeta) {
        let auth = this.flow.authorizeAccount()
        const tx = await fcl.send([fcl.transaction(mintTx), 
            fcl.args([fcl.arg(quantity, types.Int),
            fcl.arg(filemeta, types.Dictionary({key: types.String, value: types.String}))]),
            fcl.payer(auth),
            fcl.authorization(auth),
            fcl.proposer(auth),
            fcl.limit(9999)])    
        return fcl.tx(tx).onceSealed()
    }


}

exports.MarketService = MarketService;