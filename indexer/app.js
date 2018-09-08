'use strict'

const fs = require('fs-extra');
const ini = require('ini');
let objConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const server = require('server');
const { get, post } = server.router;
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({
    host: objConfig.ipfs.node,
    port: objConfig.ipfs.port,
    protocol: objConfig.ipfs.protocol
  });
  const { header } = server.reply;  // OR server.reply;

  let _environment = process.env.NODE_ENV || 'development';
  let cors = [];
  
  switch(_environment.toLowerCase()) {
      case 'production' :
          cors = [
              ctx => header("Access-Control-Allow-Origin", "localhost"),
              ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
              ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
          ];
      break;
      case 'development' :
      default :
          cors = [
              ctx => header("Access-Control-Allow-Origin", "*"),
              ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
              ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
          ];      
      break;
  }
  
  // Launch server with options and a couple of routes
  server({ port: 8080, security: false}, cors, [ //Forgive the security:false pls&thx
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
  get('/user/:address', ctx => {
      // Gets a specified users details

      // @todo - query the smart contract and ipfs for this
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

function ipfsAddJson (obj) {
    return new Promise (function (resolve, reject){
        ipfs.addJSON(obj, function (err, res){
            resolve(res);
            if (err) reject(err)
            resolve(res);
        })
    })
}
