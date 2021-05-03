const fs = require('fs').promises
const constants = require('./config/constants')

// Only deploys to default service account now
// But can be easily fixed adding extra auth
async function deploy (flowService) {
  
  // let code = await fs.readFile(constants.Contracts.NonFungibleTokenPath)
  let auth = flowService.authorizeAccount()
  // let res  = await flowService.addContract('NonFungibleToken', code, auth, auth, auth)
  
  // if(!res) throw new Error('Contract Deployment no response')
  
  let code2 = await fs.readFile(constants.Contracts.FleeNFTPath, 'utf-8')

  let res2 = await flowService.addContract('FleeNFT', code2, auth, auth, auth).catch(e=> console.log(e))
  
  if(!res2) throw new Error('Error Deployig FleeNFT') 

  return {
    res2,
    res
  }
}

async function deploymarket(flowService) {}

exports.deploy = deploy