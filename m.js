
const Web3 = require('web3');
let privateKey = ""; // provide private key from okide metamask wallet: if need to import more blacklist here

let web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545')); // Binance Smart chain testnet
const abi_array = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "_ip_address", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "name": "BlackListAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "old_ip", "type": "string" }, { "indexed": false, "internalType": "string", "name": "new_ip", "type": "string" }], "name": "IpBlacklistMappingUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "_ip_address", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "name": "RequestReceived", "type": "event" }, { "inputs": [], "name": "BlackListCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "blacklists", "outputs": [{ "internalType": "string", "name": "_ip_address", "type": "string" }, { "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string[]", "name": "ip_addresses", "type": "string[]" }, { "internalType": "uint256[]", "name": "_timestamp", "type": "uint256[]" }], "name": "importIpBlacklistArray", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string[]", "name": "ip_addresses", "type": "string[]" }, { "internalType": "uint256[]", "name": "_timestamp", "type": "uint256[]" }], "name": "importIpBlacklistArrayMapping", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "ipBlackLists", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "string", "name": "ip", "type": "string" }, { "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "removeIpBlackListAddressMapping", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "requestLogs", "outputs": [{ "internalType": "string", "name": "_ip_address", "type": "string" }, { "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_count", "type": "uint256" }], "name": "setMaxLoopTimes", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "ip_addresses", "type": "string" }], "name": "validateHttpRequest", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
// const contracts_address = "0x3339022A9F3b70727EbE23f9cDEd4Af0Df90FE43"; // deployed contract, not used
const contracts_address = "0xDb7E856Bc979Da061Cb4285A405247E805D38786"; // deployed by Okide wallet: 0x7fDd3058dc461Ec3388d27C53Db1570a929c666b

web3.eth.accounts.wallet.add('0x' + privateKey);
creatorWalletAddress = web3.eth.accounts.wallet[0].address;

const blacklists = new web3.eth.Contract(abi_array, contracts_address);
let blacklistCounts = await blacklists.methods.BlackListCount().call();


/* 

// TO ADD SOME BLACKLIST
let importingSomeBlackList = await blacklists.methods.importIpBlacklistArray(
    ["0.0.0.76", "0.0.0.77", "0.0.0.75"],
    ["1634617746","163461777","1634617748"]
    ).send({
        from: creatorWalletAddress,
        gasLimit: web3.utils.toHex(250000),  
        gasPrice: web3.utils.toHex(40000000000), 
    });
     console.log(importingSomeBlackList); 
     
     */

console.log("blacklist counts", blacklistCounts);

let ipBlackLists = [];
for (var i = 1; i <= blacklistCounts; i++) {
    const blacklist = await blacklists.methods.ipBlackLists(i).call();
    ipBlackLists.push(blacklist);

}
console.log("BLACKLISTS ARRAY ", ipBlackLists);
 // sample: [ Result { '0': '1', '1': '0.0.0.2', '2': '1634561614', id: '1', ip: '0.0.0.2', entry_time_stamp: '1634561614' } ]

