pub contract FCL {
//   pub let storagePath: StoragePath

  pub struct Account {
    pub let type: String
    pub let address: Address
    pub let keyId: Int
    pub var label: String

    init(_ address: Address) {
      self.type = "ACCOUNT"
      self.address = address
      self.keyId = 0
      self.label = ""
    }
  }

  pub resource Root {
    pub let key: [UInt8]
    pub let accounts: {Address: Account}

    init (_ key: String) {
      self.key = key.decodeHex()
      self.accounts = {}
    }

    pub fun add(_ acct: Account) {
      self.accounts[acct.address] = acct
    }
  }

  pub fun accounts(): {Address: Account} {
    return self.account.borrow<&Root>(from: /storage/FCL_DEV_WALLET)!.accounts
  }

  pub fun getServiceKey(): [UInt8] {
    return self.account.borrow<&Root>(from: /storage/FCL_DEV_WALLET)!.key
  }

  pub fun new(): AuthAccount {
    let acct = AuthAccount(payer: self.account)
    acct.addPublicKey(self.getServiceKey())

    self.account
      .borrow<&Root>(from: /storage/FCL_DEV_WALLET)!
      .add(Account(acct.address))

    return acct
  }

  init () {
  
    self.account.save(<- create Root("abda"), to: /storage/FCL_DEV_WALLET)
  }
}