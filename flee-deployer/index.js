//import addContract from './services/deploy.js'

var f = require('@onflow/fcl')
var flow = require('./services/flow')
var deploy = require('./services/deploy')
var constants = require('./services/config/constansts')
var fs = require('fs')

f.config()
  .put('OxFT', constants.addresses.FungibleTokenAddress)
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

let payeract = ""
let payerpk = 'b23fcd50061846c26c466fdcd6e837b096da2d463c8740e9174cf5b9ab872d1f'
let pk =  "bf9db4706c2fdb9011ee7e170ccac492f05427b96ab41d8bf2d8c58443704b76"
var j = new flow.FlowService("0xf8d6e0586b0a20c7",0,pk)

let auth = j.authorizeAccount()
let code = fs.readFileSync('contracts/Flees.cdc', 'utf-8')

j.createFlowAccount()

j.addContract('Flees', code, auth, auth, auth)

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