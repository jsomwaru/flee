//import addContract from './services/deploy.js'

var f = require('@onflow/fcl')
var flow = require('./services/flow')
var deploy = require('./services/deploy')
var fs = require('fs')

f.config()
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

let pk =  "e07c3378c90c8a06ff4d9d2c67aec9e0610e5f4933dbca3be9d50e834715add0"
var j = new flow.FlowService("0xf8d6e0586b0a20c7",'0',pk)

let auth = j.authorizeAccount()
console.log(auth)

j.addContract('Flees', fs.readFileSync('contracts/Flees.cdc'), auth, auth, auth)




// run().then((r)=> {
//     console.log(r.keys)
// })

// async function run(j){
//     return await f.send([f.getAccount("0x01cf0e2f2f715450)")])
//     //console.log(5)
// }

// async function run1(j){
//     return await j.getAccount('0x045a1763c93006ca')
//     //console.log(5)
// }

// let a = j.authorizeAccount()
// a()

// var de = new deploy.Deployer(j)

// de.deployInterfaces().then(results => {
    //     console.log(results.keys())
    // })
    
    //auth = j.authorizeAccount()
    
    
    //  files = fs.readdirSync('contracts', (err, files) => {
        //     if (err) throw new Error('Error reading from contract direcotry.')
        //     return files
        //   })
        
        //   files.forEach(file => {
            //       console.log(file)
            //   })
            
// j.createFlowAccount().then(r => {
//     console.log(r)
// })
//console.log(s.authorization())