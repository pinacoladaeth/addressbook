const ens = require('./setup')
const fs = require('fs')
const path = require('path')

const topDomain = 'eth'
const subDomains = [
  'alice',
  'bob',
].map(sub => {
  return {top: topDomain, sub: sub}
})

const main = async () => {
  console.log('test')
  const addresses = await ens.start()
  console.log('ens started')
  fs.writeFileSync(path.join(__dirname, 'addresses.json'), JSON.stringify(addresses), 'utf8')
  subDomains.reduce(async (_, domain) => ens.registerSubdomain(domain.top, domain.sub))
}

main()
