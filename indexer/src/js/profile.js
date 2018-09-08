const web3 = require('web3')
const ini = require('ini')
const fs = require('fs')
let objConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({
    host: objConfig.ipfs.node,
    port: objConfig.ipfs.port,
    protocol: objConfig.ipfs.protocol
  });
let objProvider;

if(objConfig.web3.provider_type === 'http') {
    objProvider = new web3.providers.HttpProvider(objConfig.web3.provider);
} else {
    objProvider = new web3.providers.WebsocketProvider(objConfig.web3.provider);
}
let objWeb3 = new web3(objProvider);
let objContract = new objWeb3.eth.Contract(objConfig.contract.abi, objConfig.contract.address);

const getProfile = async (address) => {
    try {
        await objContract.methods.getProfile(address).call();
    } catch (e) {
        console.log(e);
    }
}

const getIpfsData = (_hash) => {
    ipfs.catJSON(_hash, (err, result) => {
        if(err) return '';
        return result;
    });
}

module.exports = {
    getProfile: getProfile,
    getIpfsData: getIpfsData
}
