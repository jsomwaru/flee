var fcl = require('@onflow/fcl')
var rlp = require('@onflow/rlp')
var el = require('elliptic').ec;
var sha = require('sha3')

// This class perform operations on accounts
// and block in the blockchain
class FlowService {

    constructor(
        accountAddr,
        accountIndex,
        privateKey
    ) {
        this.accountAddr = accountAddr
        this.accountIndex = accountIndex
        this.privateKey = privateKey
    }

    getAccount(addr) {
        const account = fcl.send([fcl.getAccount(addr)])
        return account
    }

    // provides authorization context to executeing account
    authorize(addr, accountIndex, privateKey) {
        return async (account) => {
            let user = await this.getAccount(addr)
            let key = user.keys[accountIndex]
            let sequenceNum;
            if (account.role.proposer) {
                sequenceNum = key.sequenceNumber
            }
            const signingFunction = async (data) => {
                return {
                    addr: user.address,
                    keyId: 0,
                    signingFunction: this.signWithKey(
                        privateKey, data.message)
                };
            };
            return {
                ...account,
                signingFunction,
                addr: user.address,
                keyId: key.index,
                sequenceNumber: sequenceNum,
                signature: account.signature,
                resolve: null,
                roles: account.roles
            };
        };
    }


    authorizeAccount() {
        return this.authorize(
            this.accountAddr,
            this.accountIndex,
            this.privateKey
        )
    }

    encodePublicKey(key) {
        return rlp.encode(Buffer.from(key, 'hex'), 2, 3, 1000)
            .toString('hex')
    }


    async addContract(name, code, proposer, authorizor, payer) {
        const contract = Buffer.from(code, "utf-8").toString("hex")
        let response = await fcl.send([
            fcl.transaction`
            transaction(name: String, code: String) {
                let signer: AuthAccount
                prepare(signer: AuthAccount) {
                  self.signer = signer
                }
                execute {
                  self.signer.contracts.add(
                    name: name,
                    code: code.decodeHex()
                  )
                }
              }`,
            fcl.args([fcl.arg(name, String), fcl.arg(contract, String)]),
            fcl.proposer(proposer),
            fcl.authorizations([authorizor]),
            fcl.payer(payer),
            fcl.limit(9999)
        ]);
        return await fcl.tx(response).onceSealed()
    }

    async createFlowAccount() {
        let keys = this.genKeys()
        let auth = this.authorizeAccount()
        let response = await fcl.send([
            fcl.transaction`
            transaction(publicKey: String) {
                let payer: AuthAccount
                prepare(payer: AuthAccount) {
                    self.payer = payer
                }
                execute {
                    let account = AuthAccount(payer: self.payer)
                    account.addPublicKey(publicKey.decodeHex())
                }
            }`
            ,
            fcl.args([fcl.arg(keys.flowkey, String)]),
            fcl.proposer(auth),
            fcl.authorizations([auth]),
            fcl.payer(auth),
            fcl.limit(9999)])
        // Search for the account created event

        const events = fcl.tx(response).onceSealed()
        const accountCreated = events.find(
            (i) => i.type === "flow.AccountCreated"
        )
        if (!accountCreated) throw new Error("Account not created")
        let addr = accountCreated.data.address
        addr = addr.replace("0x", "")
        if (!addr) throw new Error("Address not found")

        const account = this.getAccount(addr)
        const key = acount.keys.find(
            (i) => i.publicKey === keys.publicKey
        )
        if (!key) throw new Error("Account public key not found")

        return {
            address: addr,
            public: keys.publicKey,
            private: keys.privateKey
        }
    }

    genKeys() {
        var ec = new el("curve25519")
        const keys = ec.genKeyPair()
        const publickey = keys.getPublic("hex")
        const priv = keys.getPrivate("hex")
        return {
            publicKey: publickey,
            privateKey: priv,
            flowkey: this.encodePublicKey(publickey),
        }
    }

    // Look into this
    signMsg(privKey = this.privateKey, msg) {
        const key = el.KeyFromPrivate(Buffer.from(privKey, 'hex'))
        const sig = key.sign(this.hashMsg(msg))
        const n = 32;
        const r = sig.r.toArrayLike(Buffer, "be", n);
        const s = sig.s.toArrayLike(Buffer, "be", n);
        return Buffer.concat([r, s]).toString("hex");
    }

    hashMsg(msg) {
        let hash = new sha.SHA3(256)
        hash.update(Buffer.from(msg, 'hex'))
        return hash.digest()
    }

    async addPublicKey(key) {
        const encodedkey = this.encodePublicKey(key)
        var auth = this.authorizeAccount()
        let res = await fcl.send([
            fcl.transaction`
            transaction(publicKey: String) {
                let payer: AuthAccount
                prepare(payer: AuthAccount) {
                    self.payer = payer
                }
                execute {
                    let account = AuthAccount(payer: self.payer)
                    account.addPublicKey(publicKey.decodeHex())
                }
            }`
            ,
            fcl.args([encodedkey, String]),
            fcl.proposer(auth),
            fcl.authorizations([auth]),
            fcl.payer(auth),
            fcl.limit(9999)])

        return fcl.tx(res).onceSealed()
    }
}

exports.FlowService = FlowService;
 