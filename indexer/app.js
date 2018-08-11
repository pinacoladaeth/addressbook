'use strict'

const fs = require('fs-extra');
const ini = require('ini');
const web3 = require('web3');
const chalk = require('chalk');
const log = console.log;

let objConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
let objProvider;
if(objConfig.web3.provider_type === 'http') {
  objProvider = new web3.providers.HttpProvider(objConfig.web3.provider);
} else {
  objProvider = new web3.providers.WebsocketProvider(objConfig.web3.provider);
}
let objWeb3 = new web3(objProvider);

// Ensure the storage path exists and if not, create it
fs.ensureFile(objConfig.storage.path, err => {
  if(err !== undefined) {
    log(chalk.red("WARNING:") + " An error occurred when create the storage file!\r\n"+ err);
    process.exit(1);
  } else {
    // Now start getting ready to watch for the events...
    log(chalk.blue("INFO:") + " Watching for events on address "+ objConfig.contract.address);

    let objContract = new objWeb3.eth.Contract(objConfig.contract.abi, objConfig.contract.address);

    // We need to see if we should start from birth block or continue from where we last indexed...
    let intStartBlock = objConfig.contract.birth_block;
    let strCache = fs.readFileSync(objConfig.storage.path);
    let objCacheData;
    if(strCache.length) {
      objCacheData = JSON.parse(strCache);
      if(objCacheData.hasOwnProperty("last_block")) {
        intStartBlock = objCacheData.last_block > 0 ? objCacheData.last_block : objConfig.contract.birth_block;
      }
    } else {
      objCacheData = {
        "last_block": objConfig.contract.birth_block,
        "events": {
          "Connection": []
        }
      };      
      intStartBlock = objCacheData.last_block;
      }

    log(chalk.blue("INFO:") + " Starting to watch from block "+ intStartBlock);

    // Let's watch...
    setInterval(() => {
      objContract.getPastEvents(
        'Connection',
        {
          fromBlock: intStartBlock
        })
        .then(function(events){
            log(chalk.blue("INFO: ") + events.length +" events found.");
            
            events.forEach(objEvent => {
              if(objCacheData.events.Connection[objEvent.returnValues["from"]]) {
                objCacheData.events.Connection[objEvent.returnValues["from"]].connections.push(objEvent.returnValues["to"]);
              } else {
                objCacheData.events.Connection[objEvent.returnValues["from"]] = {
                  "connections": [
                    objEvent.returnValues["to"]
                  ]
                };
              }
             });

              const newConnection = Object.keys(objCacheData.events.Connection)
              .reduce((acc, key) => {acc[key] = objCacheData.events.Connection[key].connections; return acc}, {})
             return fs.writeJson(objConfig.storage.path, {last_block: objCacheData.last_block, events: newConnection});
        }).catch(console.log);
      }, 5000);
  }
});