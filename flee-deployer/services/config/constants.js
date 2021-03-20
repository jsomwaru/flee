/*
Contains constant that will be used in the deployment service
*/

// Local Contracts to be deployed
const NonFungibleTokenPath = "cadence/contracts/NonFungibleToken.cdc"
const FleeNFTPath = "cadence/contracts/FleeNFT.cdc"
const FleeTokenPath = "cadence/contracts/Flees.cdc"

// Core Contract Addresses
const FungibleTokenAddress = "0xee82856bf20e2aa6"


const Contracts = {
    NonFungibleTokenPath,
    FleeNFTPath,
    FleeTokenPath
}
const addresses = {
    FungibleTokenAddress
}

const Accountkeys = {
    serviceAccountKey: "e07c3378c90c8a06ff4d9d2c67aec9e0610e5f4933dbca3be9d50e834715add0"
}

exports.Accountkeys = Accountkeys 
exports.Contracts  = Contracts
exports.addresses   = addresses
