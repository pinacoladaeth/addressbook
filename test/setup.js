const fs = require('fs')
const path = require('path')
const namehash = require('eth-ens-namehash')
const server = require('./server')
const solc = require('solc')
const Web3 = require('web3')

let web3
let ens
let resolver
let registrar

const contractDirectory = path.join(__dirname, '..', 'contract')
const contracts = () =>
  fs.readdirSync(contractDirectory, 'utf8')
    .filter(file => path.extname(file) === '.sol')
    .reduce((acc, file) =>
      Object.defineProperty(acc, file, { value: fs.readFileSync(path.join(contractDirectory, file), 'utf8'), enumerable: true }),
    {}
    )

const compile = () =>
  solc.compile({ sources: contracts() }, 1)


const deploy = async (code, arguments = []) => {
  const contract = new web3.eth.Contract(JSON.parse(code.interface))
  const tx = contract.deploy({
    data: `0x${code.bytecode}`,
    arguments: arguments
  })
  const estimateGas = await tx.estimateGas()
  const deployed = await tx.send({
    from: web3.eth.accounts.wallet[0].address,
    gas: estimateGas
  })

  return deployed
}

const setResolver = async (name) => {
  await ens.methods.setResolver(namehash.hash(name), resolver.options.address).send({
    from: web3.eth.accounts.wallet[0].address,
    gas: 4700000
  })
  await resolver.methods.setAddr(namehash.hash(name), web3.eth.accounts.wallet[0].address).send({
    from: web3.eth.accounts.wallet[0].address,
    gas: 4700000
  })
}

const setSubdomain = async (top, sub) => {
  await ens.methods.setSubnodeOwner(namehash.hash(top), web3.utils.sha3(sub), web3.eth.accounts.wallet[0].address).send({
    from: web3.eth.accounts.wallet[0].address,
    gas: 4700000
  })
  await setResolver(`${sub}.${top}`)
}

const startServer = () => {
  server.listen()
  console.log(server.address)
  web3 = new Web3(server.address)
  web3.eth.accounts.wallet.add(server.privateKey)
}

const start = async () => {
  startServer()
  const codes = compile()
  const contracts = codes.contracts
  ens = await deploy(contracts['ENS.sol:ENS'])
  registrar = await deploy(contracts['FIFSRegistrar.sol:FIFSRegistrar'], [ens.options.address, web3.utils.toHex(0)])
  resolver = await deploy(contracts['PublicResolver.sol:PublicResolver'], [ens.options.address])
  await ens.methods.setOwner(web3.utils.toHex(0), registrar.options.address).send({
    from: web3.eth.accounts.wallet[0].address,
    gas: 4700000
  })
  await registrar.methods.register(web3.utils.sha3('eth'), web3.eth.accounts.wallet[0].address).send({
    from: web3.eth.accounts.wallet[0].address,
    gas: 4700000
  })
  await setResolver('eth')
  return {
    ens: ens.options.address,
    registrar: registrar.options.address,
    resolver: resolver.options.address
  }
}

module.exports = {
  start: start,
  registerSubdomain: setSubdomain,
  close: server.close
}
