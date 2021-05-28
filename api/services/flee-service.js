const fcl = require('@onflow/fcl')
const EC  = require('elliptic').ec
const sha = require('sha3')
const ec = new EC('p256')

class FlowService {

    constructor(address, keyIndex, privateKey) {
        this.address = address
        this.keyIndex = keyIndex
        this.privateKey = privateKey
    }

    async getAccount(addr) {
        return fcl.send([fcl.getAccount(addr)])
    }

     // provides authorization context to executeing account
    authorize(addr, accountIndex, privateKey) {
        return async (account) => {
            let user = await this.getAccount(addr)
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
            this.keyIndex,
            this.privateKey
        )
    }

    hashMsg(msg) {
        let hash = new sha.SHA3(256)
        hash.update(Buffer.from(msg, 'hex'))
        return hash.digest()
    }

    signMsg(privateKey, message) {
        const  key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
        const sig = key.sign(this.hashMsg(message)) 
        const n = 32
        const r = sig.r.toArrayLike(Buffer, "be", n)
        const s = sig.s.toArrayLike(Buffer, "be", n)
        return Buffer.concat([r,s]).toString('hex')
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


exports.FlowService = FlowService;