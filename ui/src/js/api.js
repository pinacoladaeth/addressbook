const request = require('request-promise-native')

const url = 'http://localhost:8080'

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
