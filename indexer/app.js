'use strict'

const fs = require('fs-extra');
const ini = require('ini');
let objConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const server = require('server');
const web3 = require('web3');
const { get, post } = server.router;
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({
    host: objConfig.ipfs.node,
    port: objConfig.ipfs.port,
    protocol: objConfig.ipfs.protocol
  });
const profile = require('./src/js/profile.js');

// Launch server with options and a couple of routes
server({ port: 8080, security: { csrf: false } }, [
  get('/user/:address/followers', ctx => {
    // Gets the user followers
    let strData = fs.readFileSync(objConfig.storage.path);

    if(strData.length === 0) {
        return {
            followers:[]
        };
    }

    let objCacheData = JSON.parse(strData);
    const arrFollowers = []
    for (var key in objCacheData.events.Connection) {
        if (objCacheData.events.Connection.hasOwnProperty(key)) {
            if(objCacheData.events.Connection[key][0] === ctx.params.address) {
                arrFollowers.push(key);
            }
        }
    }

    return {
        followers: arrFollowers
    };
  }),
  get('/user/:address/following', ctx => {
    // Gets the addresses the user is following
    let strData = fs.readFileSync(objConfig.storage.path);

    if(strData.length === 0) {
        return {
            following: []
        };
    }

    let objCacheData = JSON.parse(strData);
    if(ctx.params.address in objCacheData.events.Connection) {
        return {
            following: objCacheData.events.Connection[ctx.params.address]
        };
    }

    return {
        following: []
    };
  }),
  get('/user/:address', async ctx => {
      let addr = ctx.params.address;
      // Gets a specified users details

      // Check the cache data to see if we have cached the ipfs data
      let strData = fs.readFileSync(objConfig.storage.ipfs);

      // There's some data cached
      if(strData.length > 0) {
          let objCacheData = JSON.parse(strData);
          let objAddrCacheData
          // Check the cache for a key
          if(addr in objCacheData) {
              objAddrCacheData = objCacheData[addr];

              // Get the ipfs hash from the contract
              let ipfshash = '';
              try {
                  ipfshash = await getProfile(addr)
                  if(typeof ipfshash === 'undefined') {
                      ipfshash = '';
                  }
              } catch(e) {
                  console.log(e);
              }

              // Now check the ipfs hashes match in the contract and the cache
              if(ipfshash.length > 0 && ipfshash !== objAddrCacheData.hash) {
                console.log("Hashes do not match. Recaching data");
                // They don't match, so recache the data
                let ipfsdata = profile.getIpfsData(ipfshash);
                objCacheData[addr].hash = ipfsdata;
                objCacheData[addr].data = JSON.parse(ipfsdata);
                fs.writeJson(objConfig.storage.ipfs, objCacheData);
                
                return  ipfsdata;
              }
          }            
      } else {
        let objCacheData = {};
        objCacheData[addr] = {
            hash: '',
            data: {}
        };
        fs.writeJson(objConfig.storage.ipfs, objCacheData);
      }

      // Default return
      const address = ctx.params.address
      return {
          ens_domain: `${address.slice(20, 30)}.eth`,
          public_key: address,
          time: (new Date()).toString(),
          details: {
              twitter: `@${address.slice(20, 30)}`,
              website: `${address.slice(20, 30)}.com`
          }
      };
  }),
  get('/user', async ctx => {
      // Returns a list of all the users
      // This is a list of a user who have trusted themselves

      let strData = fs.readFileSync(objConfig.storage.path);

      if(strData.length === 0) {
        return {
            users: []
        };
      }

      let objCacheData = JSON.parse(strData);
      let arrUsers = Object.keys(objCacheData.events.Connection)
          .reduce((acc, connection) => {
              if (objCacheData.events.Connection[connection].includes(connection)) {
                  acc.push(connection);
              }
              return acc
          }, []);

      return {
          users: arrUsers
      };
  }),
  post('/ipfs/upload',async ctx => {
      // Uploads to ipfs

      try {
          JSON.parse(ctx.data);
      } catch (e) {
          return {
              error: 'Invalid JSON in postbody'
          }
      }

      try{
        var _hash = await ipfsAddJson(ctx.data);
      }
      catch(e) {
          console.log(e)
        return {
            error: e
        }
      }

      return {
          hash: _hash
      }

  })

]);
console.log("Server started.");

function ipfsAddJson (obj) {
    return new Promise (function (resolve, reject){
        ipfs.addJSON(obj, function (err, res){
            resolve(res);
            if (err) reject(err)
            resolve(res);
        })
    })
}

function getProfile (addr) {
    return new Promise(function(resolve, reject) {
        resolve(profile.getProfile(addr));
    });
}