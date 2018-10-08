const connect = require('connect')
const serveStatic = require('serve-static')
connect().use(serveStatic(__dirname)).listen(8000, function(){
    console.log('Server running on 8000...')
})
