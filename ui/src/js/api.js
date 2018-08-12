const request = require('request-promise-native')

const url = ''

const getUrl = (path) => `${url}${path}`

const followers = async (address) => {
    const html = await request.get(getUrl(`/user/${address}/followers`))
    return JSON.parse(html).followers
}

const following = async (address) => {
    const html = await request.get(getUrl(`/user/${address}/following`))
    return JSON.parse(html).following
}

const infos = async (address) => {
    const html = await request.get(getUrl(`/user/${address}`))
    return JSON.parse(html)
}

module.exports = {
    followers: (address) => [],
    following: (address) =>  [],
    infos: (address) => { return {
        ens_domains: 'thibmeu.eth',
        publickey: address,
        time: 'Sat Aug 11 2018 17:39:17 GMT+0100 (BST)',
        details: {
            twitter: '@thibmeu',
            github: 'thibmeu',
            tripadvisor: 'thibmeu'
        }
    } },
    users: async () => { return { '0x70cd64a912ce15728a1136882637b4c2ba0d5d86': {
            ens_domains: 'thibmeu.eth',
            publickey: '0x70cd64a912ce15728a1136882637b4c2ba0d5d86',
            time: 'Sat Aug 11 2018 17:39:17 GMT+0100 (BST)',
            details: {
                twitter: '@thibmeu',
                github: 'thibmeu',
                tripadvisor: 'thibmeu'
            }
        },
        '0x1a9e26917023a9eca3b544b631609054c0b1528e': {
            ens_domains: 'vitalik.eth',
            publickey: '0x1a9e26917023a9eca3b544b631609054c0b1528e',
            time: 'Sat Aug 11 2018 17:39:17 GMT+0100 (BST)',
            details: {
                twitter: '@vitalik',
                github: 'vitalik',
                website: 'vitalik.ca'
            }
        }} }
}
