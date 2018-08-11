window.Web3 = require('web3')

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
            tabs.forEach(el => { getTabSection(el).style.display = 'none';
                el.classList.remove('is-active') })
            element.classList.add('is-active')
            getTabSection(element).style.display = 'block'
        }
    })
    if (tabs.length > 0) {
        tabs[0].click()
    }
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
        console.log(`TODO: filter with ${search.value}`)
    }
}

const init = () => {
    initTabs()
    initRegistration()
    initAddressBook()
}

const main = () => {
    init()
}

main()
