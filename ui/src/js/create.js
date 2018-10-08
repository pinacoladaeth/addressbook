const api = require('./api')
const utils = require('./utils')

const getPicture = (user) => {
    return (typeof user.details.picture !== 'undefined') ? user.details.picture : 'https://bulma.io/images/placeholders/96x96.png'
}

const addressbookCard = (user) => {
    const template = document.createElement('template')
    const picture = getPicture(user)
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
                        <p class="title is-4"><a>${user.ens_domain}</a></p>
                        <p class="subtitle is-6">${user.public_key}</p>
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

const profileCard = (user) => {
    const template = document.createElement('template')

    const picture = getPicture(user)
    const details = Object.keys(user.details).reduce(
        (acc, key) => `${acc}${utils.capitalize(key)}: <a>${user.details[key]}</a> <br/>`,
        '')
    const editDetails = Object.keys(user.details).reduce(
        (acc, key) => `${acc}<div class="field has-addons m-0">
                        <p class="control">
                            <a class="button is-static">${utils.capitalize(key)}</a>
                        </p>
                        <p class="control is-expanded">
                            <input class="input" type="text" value="${user.details[key]}">
                        </p>
                    </div>`,
        '')

    const html = `
    <div class="container w-100 mt-2">
        <div class="card" id="consultProfileCard">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="${picture}" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">${user.ens_domain}</p>
                        <p class="subtitle is-6">${user.public_key}</p>
                    </div>
    
                    <div class="media-right">
                        <a id="editProfileButton"><span class="icon"><i class="fas fa-edit"></i></span></a>
                        <a id="followProfileButton" class="button">Follow</a>
                    </div>
                </div>
    
                <div class="content">
                    ${details}
                    <br/>
                    <time datetime="2016-1-1">${user.time}</time>
                </div>
            </div>
        </div>
    
        <div class="card is-hidden" id="editProfileCard">
            <form class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="${picture}" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <div class="field">
                            <div class="control">
                                <input class="input is-medium" type="text" placeholder="Text input" value="${user.ens_domain}">
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <input class="input" type="text" placeholder="Text input"
                                       value="${user.public_key}">
                            </div>
                        </div>
                    </div>
    
                    <div class="media-right">
                        <a id="cancelEditProfileButton"><span class="icon"><i class="fas fa-times"></i></span></a>
                    </div>
                </div>
    
                <div class="content mt-1">
                    ${editDetails}
                    <div class="field is-right">
                        <div class="control has-text-centered">
                            <a id="confirmEditButton" class="button is-info">
                                <span class="text">Confirm</span>
                                <span class="icon"><i class="fas fa-check"></i></span>
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    `

    template.innerHTML = html.trim()

    return template.content.firstChild
}

const mediaUserCard = (user) => {
    const template = document.createElement('template')

    const picture = getPicture(user)

    const html = `
        <div class="media">
            <div class="media-left">
                <figure class="image is-48x48 m-0">
                    <img src="${picture}" alt="Placeholder image">
                </figure>
            </div>
            <div class="media-content">
                <p class="title is-6">${user.ens_domain}</p>
                <p class="subtitle is-6">${user.public_key.slice(0, 8)}</p>
            </div>
        </div>
    `

    template.innerHTML = html.trim()
    return template.content.firstChild
}

const mediaUserCards = async (addresses) => {
    const users = await Promise.all(addresses.map(api.infos))

    return users.reduce((acc, user) => `${acc}${mediaUserCard(user).outerHTML}`, '')
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
                        ${followingCards}
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
                        ${followerCards}
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
    followingFollowersCards: followingFollowersCards,
    profileCard: profileCard
}
