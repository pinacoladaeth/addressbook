const ganache = require('ganache-cli')

// !!! DON'T USE THIS KEY ELSEWHERE !!!
const privateKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
const port = 8545
const server = ganache.server({
  accounts: [{
    balance: 0x200000000000000000000000000000000000000000000000000000000000000,
    secretKey: privateKey
  }],
  port: port
})

module.exports = {
  privateKey: privateKey,
  port: port,
  address: `ws://localhost:${port}`,
  listen: () => { server.listen(port) },
  close: () => { server.close() }
}
