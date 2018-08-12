'use strict'

const fs = require('fs-extra');
const ini = require('ini');
const server = require('server');
const { get, post } = server.router;
 
let objConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

// Launch server with options and a couple of routes
server({ port: 8080 }, [
  get('/user/:address/followers', ctx => {
    // Gets the user followers
    let strData = fs.readFileSync(objConfig.storage.path);

    if(strData.length === 0) {
        return {
            "followers":[]
        };
    }

    let objCacheData = JSON.parse(strData);
    let arrFollowers = [];
    for (var key in objCacheData.events.Connection) {
        if (objCacheData.events.Connection.hasOwnProperty(key)) {
            if(objCacheData.events.Connection[key][0] === ctx.params.address) {
                arrFollowers.push(key);
            }
        }
    }

    return {
        "followers": arrFollowers
    };
  }),
  get('/user/:address/following', ctx => {
    // Gets the addresses the user is following
    let strData = fs.readFileSync(objConfig.storage.path);

    if(strData.length === 0) {
        return {
            "following":[]
        };
    }

    let objCacheData = JSON.parse(strData);
    if(ctx.params.address in objCacheData.events.Connection) {
        return {
            "following": objCacheData.events.Connection[ctx.params.address]
        };
    }

    return {
        "following":[]
    };
  }),
  get('/user/:address/details', ctx => {
      // Gets a specified users details

      // @todo
  }),
  get('/user', ctx => {
      // Returns a list of all the users
      // This is a list of a user who have trusted themselves

      let strData = fs.readFileSync(objConfig.storage.path); 

      if(strData.length === 0) {
        return {
            "users":[]
        };
      }

      let objCacheData = JSON.parse(strData);
      let arrUsers = [];
      for (var key in objCacheData.events.Connection) {
          if (objCacheData.events.Connection.hasOwnProperty(key)) {
              objCacheData.events.Connection[key].forEach(element => {
                  if(element === key) {
                      arrUsers.push(key);
                  }
              });
          }
      }
  
      return {
          "users": arrUsers
      };
  })
]);