const fs = require('fs').promises
const constants = require('./config/constants')

// Only deploys to default service account now
// But can be easily fixed adding extra auth
async function deploy (flowService) {
  let serviceAccountAddress ='0xf8d6e0586b0a20c7'
  let fungibletokenaddress = '0xee82856bf20e2aa6'
  let flowtokenaddress = '0x0ae53cb6e3f42a79'
  let code = await fs.readFile(constants.Contracts.NonFungibleTokenPath)
  let auth = flowService.authorizeAccount()
  
  let res  = await flowService.addContract('NonFungibleToken', code, auth, auth, auth) 
  if(!res) throw new Error('Contract Deployment no response')
  
  let fleenft = await fs.readFile(constants.Contracts.FleeNFTPath, 'utf-8')
  fleenft = fleenft.replace(/\"\.\/NonFungibleToken.cdc\"/i, serviceAccountAddress)
  let res2 = await flowService.addContract('FleeNFT', fleenft, auth, auth, auth).catch(e=> console.log(e))
  
  if(!res2) 
    throw new Error('Error Deployig FleeNFT') 

  let fleemarket = await fs.readFile(constants.Contracts.FleeMarketPath, 'utf-8')
  fleemarket = fleemarket.replace(/\"\.\/FungibleToken.cdc\"/i, fungibletokenaddress)
  fleemarket = fleemarket.replace(/\"\.\/NonFungibleToken.cdc\"/i, serviceAccountAddress)
  fleemarket = fleemarket.replace(/\"\.\/FleeNFT.cdc\"/i, serviceAccountAddress)
  fleemarket =  fleemarket.replace(/\"\.\/FlowToken.cdc\"/i, flowtokenaddress)
 
  let res3 = flowService.addContract('FleeMarket', fleemarket, auth, auth, auth).catch(e=> console.log(e))

  return {
    res,
    res2,
    res3
  }
}

async function deployFCL(flowService) {
  let auth = flowService.authorizeAccount()
  let fclDev =  await fs.readFile('cadence/contracts/fcl.cdc', 'utf-8')
  let res = flowService.addContract('FCL', fclDev,auth, auth, auth)
  return res
}


exports.deploy = deploy
exports.deployFCL = deployFCL