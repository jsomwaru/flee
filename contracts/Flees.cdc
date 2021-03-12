import FungibleToken from 0xee82856bf20e2aa6

pub contract Flees: FungibleToken {
    
    pub var totalSupply: UFix64

    pub event TokensInitialized(initialSupply: UFix64)

    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    pub event TokensDeposited(amount: UFix64, to: Address?)

    pub event TokensBurned(amount: UFix64)

    pub event TokensMinted(amount: UFix64)

    pub event MinterCreated(allowedAmount: UFix64)

    pub resource Vault : FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance{
        pub var balance: UFix64

        init(balance: UFix64) { 
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            // return to calling context to replace with other vault
            // tmp storage 
            return <- create Vault(balance: self.balance)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @Flees.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            destroy vault
        }
    }

    pub resource Admin {
        pub fun createMinter(amountAllowed: UFix64): @Minter {
            emit MinterCreated(allowedAmount: amountAllowed)
            return <- create Minter(allowedAmount: amountAllowed)
        }
    }

    pub resource Minter {
        pub var amountAllowed: UFix64

        init(allowedAmount: UFix64) {
            self.amountAllowed = allowedAmount
        }

        pub fun mintTokens(amount: UFix64): @Flees.Vault {
            pre {
                amount >= 0.0: "Amount must be greater than 0"
                amount < self.amountAllowed : "Amount is greater than amount allowed"
            }
            Flees.totalSupply = Flees.totalSupply + amount
            self.amountAllowed = self.amountAllowed - amount
            emit TokensMinted(amount: amount)
            return <- create Vault(balance: amount)
        }
    }

    pub fun createEmptyVault(): @FungibleToken.Vault {
        return <-create Vault(balance: 0.0)
    }

    init() {
        self.totalSupply  = 0.0
    }
}
