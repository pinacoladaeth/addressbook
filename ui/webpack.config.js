module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    plugins: [
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}
