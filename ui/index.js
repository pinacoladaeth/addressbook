window.Web3 = require('web3')
window.web3 = new Web3(window.web3.currentProvider)
const api = require('./src/js/api')
const create = require('./src/js/create')
const ens = require('./src/js/ens')
// const ens = {register: () => {}}

const checkEthNetwork = () => {
    setInterval(()=>{
        window.web3.eth.net.getId().then((nid) => {
            switch(nid){
                case 1 : //mainnet
                case 2 : //testnet
                case 4 : //testnet
                default:
                    document.querySelector('#wrongnetwork').style.display = "inline";
                    document.querySelector("#wrongnetwork").innerText = "Please switch network to Ropsten";
                    document.querySelectorAll("input").forEach((a)=>{a.setAttribute("disabled","");});
                    break;
                case 3 : //ropsten
                    document.querySelector("#wrongnetwork").style.display = "none";
                    document.querySelectorAll("input").forEach((a)=>{a.removeAttribute("disabled");});
                    break;
            }
        })
    }, 1000)
}

const checkForWeb3Account = () => {
    setInterval(()=>{
        window.web3.eth.getAccounts().then((acc) => {
            if(typeof acc === 'undefined' || acc.length === 0) {
                document.querySelector("#wrongnetwork").style.display = "inline";
                document.querySelector("#wrongnetwork").innerText = "Please unlock your web3 client";
                document.querySelectorAll("input").forEach((a)=>{a.setAttribute("disabled","");});
            } else {
                document.querySelector("#wrongnetwork").style.display = "none";
                document.querySelectorAll("input").forEach((a)=>{a.removeAttribute("disabled");});
            }
        })
    })
}

const checkFormValidity = () => {
    const form = document.querySelector('form');
    const validation = form.querySelector('input[type=submit]');
    validation.click();
    return form.checkValidity();
};

const getTabSection = (tab) => {
    return document.getElementById(tab.getAttribute('data'))
}

const initTabs = () => {
    const tabs = document.querySelector('.tabs > ul').querySelectorAll('li')
    tabs.forEach(element => {
        element.onclick = () => {
            tabs.forEach(el => {
                getTabSection(el).style.display = 'none';
                el.classList.remove('is-active')
            })
            element.classList.add('is-active')
            getTabSection(element).style.display = 'block'
            location.hash = `#${element.getAttribute('data').toLowerCase()}`
        }
    })

    tabs[Array.from(tabs).reduce((acc, tab, index) =>
            (tab.getAttribute('data').toLowerCase() === location.hash.split('-')[0].slice(1).toLowerCase()) ? index : acc,
        0)].click()
}

const initRegistration = () => {
    const registerButton = document.querySelector('#registerButton')
    registerButton.onclick = async () => {
        if (checkFormValidity()) {
            alert('coucou')
        }
    }
}

const initAddressBook = async () => {
    const addressbookSection = document.querySelector('#addressbookSection')
    const search = addressbookSection.querySelector('#addressbookSearch')

    let users = await api.users()
    users = await Promise.all(users.map(api.infos))
    users = users.reduce((acc, user) => {
        acc[user.public_key] = user
        return acc
    }, {})
    // users = Object.keys(users).map((key, index) => {
    //     const user = users[key]
    //     user.ens_domain = `${''.padEnd(index+1, 'a')}.eth`
    //     user.details.twitter = '@coucou'
    //     user.details.website = 'perdu.com'
    //     user.time = (new Date()).toString()
    //     delete user.details.picture
    //     return user
    // })

    search.oninput = () => {
        const cards = addressbookSection.querySelector('.cards')
        cards.innerHTML = ''

        const request = search.value

        Object.keys(users)
            .filter(key => {
                const user = users[key]
                return [
                    user.public_key,
                    user.ens_domain,
                    ...Object.keys(user.details),
                    ...Object.values(user.details)
                ].reduce((acc, el) => request === '' || acc || el.toLowerCase().includes(request.toLowerCase()), false)
            }).slice(0, 10)
            .map(key => {
                const user = users[key]
                const card = create.addressbookCard(user)
                card.querySelector('.media-content > .title').onclick = () => {
                    accessProfile(user.public_key)
                }
                cards.appendChild(card)
            })
    }

    search.oninput()
}

const initProfile = async (user) => {
    // const web3Address = (typeof web3 === 'undefined') ? '0x70cd64a912ce15728a1136882637b4c2ba0d5d86' : web3.eth.accounts[0]
    const web3Address = '0x70cd64a912ce15728a1136882637b4c2ba0d5d86'
    if (typeof user === 'undefined') {
        if (location.hash.split('-').length > 1) {
            user = await api.infos(location.hash.split('-')[1])
        } else {
            user = await api.infos(web3Address)
        }
    }
    // if (typeof web3 === 'undefined') {
    //     document.querySelector('.tabs')
    //         .querySelector('li[data=profileSection]')
    //         .classList.add('is-hidden')
    //     return
    // }

    const profileSection = document.querySelector('#profileSection')

    const profileCard = profileSection.querySelector('#profileCard')
    profileCard.innerHTML = ''
    profileCard.appendChild(create.profileCard(user))

    const editButton = profileCard.querySelector('#editProfileButton')
    const editCard = profileCard.querySelector('#editProfileCard')
    const cancelEditButton = profileCard.querySelector('#cancelEditProfileButton')
    const consultCard = profileCard.querySelector('#consultProfileCard')
    const confirmEditButton = profileCard.querySelector('#confirmEditButton')
    const followButton = profileCard.querySelector('#followProfileButton')

    editButton.onclick = () => {
        consultCard.classList.add('is-hidden')
        editCard.classList.remove('is-hidden')
    }
    cancelEditButton.onclick = () => {
        editCard.classList.add('is-hidden')
        consultCard.classList.remove('is-hidden')
    }
    confirmEditButton.onclick = () => {
        console.log('should be confirmed')
        editCard.classList.add('is-hidden')
        consultCard.classList.remove('is-hidden')
    }
    followButton.onclick = () => {
        ens.register(user.ens_domain, user.public_key)
    }

    if (web3Address === user.public_key) {
        followButton.classList.add('is-hidden')
        editButton.classList.remove('is-hidden')
    } else {
        editButton.classList.add('is-hidden')
        followButton.classList.remove('is-hidden')
    }

    const followers = await api.followers(user.public_key)
    if (followers.includes(web3Address)) {
        followButton.innerText = 'Trusted'
        followButton.classList.add('is-disabled')
    }

    const followersFollowing = profileSection.querySelector('.followersFollowing')
    followersFollowing.innerHTML = ''
    Array.from(await create.followingFollowersCards(user.public_key))
        .map(el => { followersFollowing.appendChild(el) })
}

const init = () => {
    initTabs()
    initRegistration()
    initAddressBook()
    initProfile()
    checkEthNetwork()
    checkForWeb3Account()
}

const accessProfile = async (address) => {
    document.querySelector('.tabs').querySelector('li[data=profileSection]').click()
    location.hash = `${location.hash}-${address}`

    const user = await api.infos(address)
    initProfile(user)
}

const main = () => {
    init()
}

main()
