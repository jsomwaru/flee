const fcl = require('@onflow/fcl')


class FlowService {

    constructor(address, keyIndex, privateKey) {
        this.address = address
        this.keyIndex = keyIndex
        this.privateKey = privateKey
    }

    getAccount(addr) {
        return fcl.send([fcl.getAccount(addr)])
    }

     // provides authorization context to executeing account
    authorize(addr, accountIndex, privateKey) {
        return async (account) => {
            let user = this.getAccount(addr)
            user = user.account
            let key = user.keys[accountIndex]
            let sequenceNum;
            if (account.role.proposer) {
                sequenceNum = key.sequenceNumber
            }
            const signingFunction = async (data) => {
                return {
                    addr: user.address,
                    keyId: key.index,
                    signature: this.signMsg(
                        privateKey, data.message)
                };
            };
            return {
                ...account,
                tempId: `authz-${user.address}`,
                signingFunction,
                addr: user.address,
                keyId: key.index,
                sequenceNumber: sequenceNum+1,
                signature: account.signature || null,
                resolve: null,
                roles: account.roles
            };
        };
    }

    authorizeAccount() {
        return this.authorize(
            this.address,
            this.accountIndex,
            this.privateKey
        )
    }
}


class FleeService {
    constructor (flowService) {

    }

    initializeAccount(addr, keyindex, signature) {
        let acct = flowService.authorize(addr, keyindex, signature)
        const code = `
        import FleeNFT from 0xFLEENFT
        transaction {
            let  acct: AuthAccount
            prepare(proposer: AuthAccount) {
                self.acct = proposer
            }
            execute {
                let collection <- FleeNFT.creatEmptyCollection()
                self.acct.save(<- collection, /storage/FleeCollection)
                self.acct.link<&FleeNFT.Collection{FleeNFT.CollectionPublic}>(/public/FleeCollectionPublic, target: /storage/FleeColection)
            }
        }` 
        
        fcl.send([fcl.transaction([new Buffer(code), acct,])])
    }   
}


exports.FleeService = FleeService;