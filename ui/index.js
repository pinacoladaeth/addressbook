window.Web3 = require('web3')

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const users = {
    "0x70cd64a912ce15728a1136882637b4c2ba0d5d86": {
        ens_domains: 'thibmeu.eth',
        time: 'Sat Aug 11 2018 17:39:17 GMT+0100 (BST)',
        details: {
            twitter: '@thibmeu',
            github: 'thibmeu',
            tripadvisor: 'thibmeu'
        }
    },
    "0x1a9e26917023a9eca3b544b631609054c0b1528e": {
        ens_domains: 'vitalik.eth',
        time: 'Sat Aug 11 2018 17:39:17 GMT+0100 (BST)',
        details: {
            twitter: '@VitalikButerin',
            github: 'vitalik',
            website: 'vitalik.ca'
        }
    }
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
        (tab.getAttribute('data').toLowerCase() === location.hash.slice(1).toLowerCase()) ? index : acc,
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

const initAddressBook = () => {
    const addressbookSection = document.querySelector('#addressbookSection')
    const search = addressbookSection.querySelector('#addressbookSearch')

    search.oninput = () => {
        const cards = addressbookSection.querySelector('.cards')
        cards.innerHTML = ''

        const request = search.value

        Object.keys(users)
            .filter(key => {
                const user = users[key]
                return [
                    key,
                    user.ens_domains,
                    ...Object.keys(user.details),
                    ...Object.values(user.details)
                ].reduce((acc, el) => request === '' || acc || el.toLowerCase().includes(request.toLowerCase()), false)
            }).slice(0, 10)
            .map(key => {
                const user = {
                    publickey: key,
                    ...users[key]
                }
                cards.appendChild(createAddressbookCard(user))
        })
    }

    search.oninput()
}

const initProfile = () => {
    const profileSection = document.querySelector('#profileSection')
    const editButton = profileSection.querySelector('#editProfileButton')
    const editCard = profileSection.querySelector('#editProfileCard')
    const cancelEditButton = profileSection.querySelector('#cancelEditProfileButton')
    const consultCard = profileSection.querySelector('#consultProfileCard')
    const confirmEditButton = profileSection.querySelector('#confirmEditButton')

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
}

const createAddressbookCard = (user) => {
    const template = document.createElement('template')
    const picture = (typeof user.details.picture !== 'undefined') ? user.details.picture : 'https://bulma.io/images/placeholders/96x96.png'
    const content = Object.keys(user.details)
        .filter(key => key !== 'picture')
        .reduce((acc, key) => `${acc} - ${capitalize(key)} <strong>${user.details[key]}</strong>`, '')
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

const init = () => {
    initTabs()
    initRegistration()
    initAddressBook()
    initProfile()
}

const main = () => {
    init()
}

main()
