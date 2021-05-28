/*
Contains constant that will be used in the deployment service
*/

// Local Contracts to be deployed
const NonFungibleTokenPath = "cadence/contracts/NonFungibleToken.cdc"
const FleeNFTPath = "cadence/contracts/FleeNFT.cdc"
const FleeTokenPath = "cadence/contracts/Flees.cdc"
const FleeMarketPath = 'cadence/contracts/FleeMarket.cdc'

// Core Contract Addresses
const FungibleTokenAddress = "0xee82856bf20e2aa6"


const Contracts = {
    NonFungibleTokenPath,
    FleeNFTPath,
    FleeTokenPath,
    FleeMarketPath
}
const addresses = {
    FungibleTokenAddress
}

const Accountkeys = {
    serviceAccountKey: "bf9db4706c2fdb9011ee7e170ccac492f05427b96ab41d8bf2d8c58443704b76"
}

exports.Accountkeys = Accountkeys 
exports.Contracts  = Contracts
exports.addresses   = addresses
