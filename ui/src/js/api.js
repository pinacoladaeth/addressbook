const request = require('request-promise-native')

const url = 'http://107.170.235.167:8080'

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
    const info = JSON.parse(html)
    info.ens_domain = 'test.eth'
    delete info.details.picture
    return info
}

const users = async () => {
    const html = await request.get(getUrl(`/user`))
    return JSON.parse(html).users
}

module.exports = {
    followers: followers,
    following: following,
    infos: infos,
    users: users
}
