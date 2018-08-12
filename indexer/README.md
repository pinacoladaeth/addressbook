# PinacoladaETH / Indexer

This package watches the pinacoladaeth contract for events and indexes it in a local json file.

The settings are stored in `config.ini` (you will need to rename `config.ini.example` to `config.ini`)

## Files

* `archive.js` - this script watches the contract for events and archives them
* `app.js` - this script is an api for the frontend to communicate with

## API

The API has 2 endpoints;

### `GET /user/<address>/following`

This returns a JSON object containing an array of addresses the user is following. If the user
is not following anyone, the array will be empty.

Example output: 

```json
{
    "following": [
        " 0x07Cff6218249a2351A174Bdc1E5b1632e8e4E673"
    ]
}
```

### `GET /user/<address>/followers`

This returns a JSON object containing an array of addresses that are following the user. If the user
is not being followed by anyone, the array will be empty.

Example output: 

```json
{
    "followers": [
        " 0x07Cff6218249a2351A174Bdc1E5b1632e8e4E673"
    ]
}
```

### `GET /user`

This returns a JSON object containing an array of addresses of users on the platform - these are users
that have trusted themselves (i.e.: registered to the platform)

Example output:

```json
{
    "users": [
        " 0x07Cff6218249a2351A174Bdc1E5b1632e8e4E673"
    ]
}
```

### `GET /user/<address>

This returns a JSON object containing the user details. Keys are consistant (except in `details`), but values may be blank.

Example output: 

```json
{
    "ens_domain": "",
    "public_key": "",
    "time": "",
    "details": {
        "twitter": "",
        "picture": "",
        "website": ""
    }
}
```

## Example config

```ini
; This is the contract settings.
; - addresss: the contract address to watch the events for
; - abi: the abi for the contract
; - birth_block: the block the contract was deployed on
[contract]
address = 0x714c881d133ed6c3e899346687cda03c47da05be
abi = '[{"constant":true,"inputs":[],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_friendNameHash","type":"bytes32"},{"name":"_friendAddr","type":"address"}],"name":"registerFriend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"addrGraph","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reverseRegistrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_person","type":"address"}],"name":"isMember","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"registryA","type":"address"},{"name":"registrarA","type":"address"},{"name":"resolverA","type":"address"},{"name":"reverseRegistrarA","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"}],"name":"Connection","type":"event"}]'
birth_block = 3815605

; This is the storage settings.
; - file: the path to the place we store the events
[storage]
path = "./data/events.json"

; This is the web3 settings
; - provider: the provider url (get one at infura.io ;))
; - provider_type: the type of provider, either http or ws
[web3]
provider = 'wss://ropsten.infura.io/ws'
provider_type = 'ws'
```