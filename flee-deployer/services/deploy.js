// learning to deploy shit
const fs = require('fs').promises
const constants = require('./config/constants')


// Only deploys to default service account now
// But can be easily fixed adding extra auth
async function deploy (flowService) {
  
  let code = await fs.readFile(constants.Contracts.NonFungibleTokenPath)
  let auth = flowService.authorizeAccount()
  let res  = await flowService.addContract('NonFungibleToken', code, auth, auth, auth)
  
  if(!res) throw new Error('Contract Deployment no response')
  
  let NFTAddress = '0xf8d6e0586b0a20c7' // or whatever it is
  code = await fs.readFile(constants.Contracts.FleeNFTPath, 'utf-8')
  code.replace("\"./NonFungibleToken\"", NFTAddress)

  let res2 = await flowService.addContract('FleeNFT', code, auth, auth, auth)
  
  if(!res2) throw new Error('Error Deployig FleeNFT') 

  code = await fs.readFile(constanst.Contracts.FleeTokenPath, 'utf-8')
  let res3 =  await flowService.addContract(('Flees', code, auth, auth, auth))  

  return {
    res2,
   res3,
   res
  }
}
exports.deploy = deploy
