const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
let addresses = fs.readFileSync(path.join(__dirname, '..', 'test','addresses.json'))
try {
    addresses = JSON.parse(addresses)
} catch (err) {
    addresses = {}
}

module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            ENS_CONTRACT_ADDRESS: (process.env.NODE_ENV === 'development') ? addresses.ens : '0x7150ac3542f7198effb1a9fdb19323b11a5e6d54'
        })
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}
