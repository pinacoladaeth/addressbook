const api = require('./api')
const utils = require('./utils')

const addressbookCard = (user) => {
    const template = document.createElement('template')
    const picture = (typeof user.details.picture !== 'undefined') ? user.details.picture : 'https://bulma.io/images/placeholders/96x96.png'
    const content = Object.keys(user.details)
        .filter(key => key !== 'picture')
        .reduce((acc, key) => `${acc} - ${utils.capitalize(key)} <strong>${user.details[key]}</strong>`, '')
        .slice(' - '.length)
    const html = `
        <div class="card">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="${picture}" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${user.ens_domains}</p>
                        <p class="subtitle is-6">${user.publickey}</p>
                    </div>
                </div>

                <div class="content">
                    ${content}
                    <br>
                    <time datetime="${user.time}">${(new Date(user.time)).toLocaleString()}</time>
                </div>
            </div>
        </div>`

    template.innerHTML = html.trim()
    return template.content.firstChild
}

const mediaUserCard = (user) => {
    const picture = (typeof user.details.picture !== 'undefined') ? user.details.picture : 'https://bulma.io/images/placeholders/96x96.png'

    const html = `
        <div class="media">
            <div class="media-left">
                <figure class="image is-48x48 m-0">
                    <img src="${picture}" alt="Placeholder image">
                </figure>
            </div>
            <div class="media-content">
                <p class="title is-6">${user.ens_domains}</p>
                <p class="subtitle is-6">${user.publickey}</p>
            </div>
        </div>
    `

    template.innerHTML = html.trim()
    return template.content.firstChild
}

const mediaUserCards = async (addresses) => {
    const users = await Promise.all(addresses.map(api.infos))

    return users.reduce((acc, user) => `${acc}${mediaUserCard(user)}`, '')
}

const followingFollowersCards = async (address) => {
    const template = document.createElement('template')

    const followers = await api.followers(address)
    const following = await api.following(address)
    const followerCards = await mediaUserCards(followers)
    const followingCards = await mediaUserCards(following)

    const html = `
        <div class="column">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="title is-4">Following (${following.length})</div>
                    </div>
                    <div class="content">
                        ${followerCards}
                    </div>
                </div>
            </div>
        </div>
        <div class="column">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="title is-4">Followers (${followers.length})</div>
                    </div>
                    <div class="content">
                        ${followingCards}
                    </div>
                </div>
            </div>
        </div>
    `

    template.innerHTML = html.trim()
    return template.content.childNodes

}

module.exports = {
    addressbookCard: addressbookCard,
    followingFollowersCards: followingFollowersCards
}
