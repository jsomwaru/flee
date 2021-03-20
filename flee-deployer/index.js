//import addContract from './services/deploy.js'

var f = require('@onflow/fcl')
var flow = require('./services/flow')
var deploy = require('./services/deploy')
var constants = require('./services/config/constants')
var fs = require('fs')

f.config()
  .put("OxFT", constants.addresses.FungibleTokenAddress)
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

let serviceAccountAddress ='0xf8d6e0586b0a20c7'
var flowService = new flow.FlowService(serviceAccountAddress, 0, constants.Accountkeys.serviceAccountKey)
let acct = flowService.getAccount(serviceAccountAddress).then(r => {
  console.log(r)
})

deploy.deploy(flowService).then(r =>  { 
    if(Object.entries(r).length == 0) console.log('Error Grabbing reponses from contract deployer.')
    else console.log(r)
  }
)


