const namehash = require('eth-ens-namehash')
const Web3 = require('web3')

const provider = (typeof window.web3 === 'undefined') ?
    new Web3.providers.WebsocketProvider('ws://localhost:8545') :
    window.web3.currentProvider
const web3 = new Web3(provider)

const contractABI = [{
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "from", "type": "address"}, {
        "indexed": false,
        "name": "to",
        "type": "address"
    }],
    "name": "Connection",
    "type": "event"
}, {
    "constant": false,
    "inputs": [{"name": "_friendNameHash", "type": "bytes32"}, {"name": "_friendAddr", "type": "address"}],
    "name": "registerFriend",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"name": "registryA", "type": "address"}, {
        "name": "registrarA",
        "type": "address"
    }, {"name": "resolverA", "type": "address"}, {"name": "reverseRegistrarA", "type": "address"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "constant": false,
    "inputs": [{"name": "_nameHash", "type": "bytes32"}, {"name": "_ipfsContentHash", "type": "string"}],
    "name": "updateProfile",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "uint256"}],
    "name": "addrGraph",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_addr", "type": "address"}],
    "name": "getProfile",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_person", "type": "address"}],
    "name": "isMember",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}],
    "name": "profile",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "registrar",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "registry",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "resolver",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "reverseRegistrar",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}]
const contractAddr = process.env.ENS_CONTRACT_ADDRESS
const contract = new web3.eth.Contract(contractABI, contractAddr)

const register = async (ensDomain, address) => {
    const nameHash = namehash.hash(ensDomain)
    try {
        await contract.methods.registerFriend(nameHash, address).send({
            from: (await web3.eth.getAccounts())[0]
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    register: register
}
