// learning to deploy shit
const fs = require('fs').promises
const path = require('path')
const constants = require('./config/constants')


class Deployer {
  
  constructor(
    flowService
  ) {
    this.flow = flowService
    this.contractsDirs = '../contracts'
  }
  // Deploys everything in contacts directory
  async deploy ()  {
    console.log("--DEPLOYING CONTRACTS--")
    // Open contracts
    files = fs.readdirSync(this.contractsDirs)
    contracts = {}
    files.forEach(file => {
      data = fs.readFileSync(path.join(this.contractsDirs, file))
      .replace(`"${file}"`, )

    })

  }

  async deployInterfaces() {
    console.log('--DEPLOYING INTERFACES--')
    return Object.keys(constants.interfaces).map(async (key) => {
      let t = await fs.readFile(constants.interfaces[key])
      let name = constants.interfaces[key].split('/').pop()
      var auth = this.flow.authorizeAccount()
      let block  = await this.flow.addContract(name ,t, auth, auth, auth)
      return {name: block}
    });
  }

}

exports.Deployer = Deployer