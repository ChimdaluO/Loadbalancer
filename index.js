const express = require('express');
const moment = require('moment');

const swStats = require('swagger-stats');
// const apiSpec = require('swagger.json');


const rps = 25;
const app = express();
app.use(express.json({ limit: '400mb' }));
app.use(express.urlencoded({ limit: '400mb', extended: true }));


const Web3 = require('web3');
let privateKey = "77a4b285b18085352ce2b8695674c46a1ab42179ecdaf078cc8c7063575b69a8"; // provide private key from okide metamask wallet: iff need to import more blacklist here
let ipDictionary = {};
let web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545')); // Binance Smart chain testnet
const abi_array = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "_ip_address", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "name": "BlackListAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "old_ip", "type": "string" }, { "indexed": false, "internalType": "string", "name": "new_ip", "type": "string" }], "name": "IpBlacklistMappingUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "_ip_address", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "name": "RequestReceived", "type": "event" }, { "inputs": [], "name": "BlackListCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "blacklists", "outputs": [{ "internalType": "string", "name": "_ip_address", "type": "string" }, { "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string[]", "name": "ip_addresses", "type": "string[]" }, { "internalType": "uint256[]", "name": "_timestamp", "type": "uint256[]" }], "name": "importIpBlacklistArray", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string[]", "name": "ip_addresses", "type": "string[]" }, { "internalType": "uint256[]", "name": "_timestamp", "type": "uint256[]" }], "name": "importIpBlacklistArrayMapping", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "ipBlackLists", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "string", "name": "ip", "type": "string" }, { "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "removeIpBlackListAddressMapping", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "requestLogs", "outputs": [{ "internalType": "string", "name": "_ip_address", "type": "string" }, { "internalType": "uint256", "name": "entry_time_stamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_count", "type": "uint256" }], "name": "setMaxLoopTimes", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "ip_addresses", "type": "string" }], "name": "validateHttpRequest", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
// const contracts_address = "0x3339022A9F3b70727EbE23f9cDEd4Af0Df90FE43"; // deployed contract, not used
const contracts_address = "0xDb7E856Bc979Da061Cb4285A405247E805D38786"; // deployed by Okide wallet: 0x7fDd3058dc461Ec3388d27C53Db1570a929c666b

web3.eth.accounts.wallet.add('0x' + privateKey);
creatorWalletAddress = web3.eth.accounts.wallet[0].address;

const blacklists = new web3.eth.Contract(abi_array, contracts_address);
let timestampLists = [];

async function getBlacklistCount(){
  let blacklistCounts = await blacklists.methods.BlackListCount().call();
  
  let ipBlackLists = [];
  
  for (var i = 1; i <= blacklistCounts; i++) {
      const blacklist = await blacklists.methods.ipBlackLists(i).call();
      ipBlackLists.push({ip: blacklist.ip, timestamp: blacklist.entry_time_stamp});
      ipDictionary[blacklist.ip] = blacklist.entry_time_stamp
  }

  console.log("BLACKLISTS ARRAY ", ipBlackLists);
}

async function addIpToBlacklist(ips, timestamps){
  let importingSomeBlackList = await blacklists.methods.importIpBlacklistArray(
    ips,
    timestamps
    ).send({
        from: creatorWalletAddress,
        gasLimit: web3.utils.toHex(250000),  
        gasPrice: web3.utils.toHex(40000000000), 
    });
}

getBlacklistCount()

const redis = require("redis");
const client = redis.createClient();

client.flushall()

const { promisify } = require("util");
const redisGet = promisify(client.get).bind(client);

client.on("error", function(error) {
  console.error(error);
});

let count = 0;

app.use(swStats.getMiddleware());

//default landing:
app.get('*', async (req, res) => {
  const ip = getUserIp(req)
  const rawData = await redisGet(ip)
  const time = Date.now()
  if(ipDictionary[ip]){
    return res.status(429).json({message: "Request Dropped because IP is blacklisted"})
  }
  if(rawData){
    const data = JSON.parse(rawData);

    const result = data.filter(item => {
      return moment(time).subtract(moment(item), 'seconds').seconds() > rps
    })

    if (result.length > rps){
      ipDictionary[ip] = time
      ipBlackLists.push(ip)
      timestampLists.push(time+'')
      return res.status(429).json({message: "Request Dropped by IPS"})
    }
    result.push(time)
    client.set(ip, JSON.stringify(result))
    
  }else{
    
    client.set(ip, JSON.stringify([Date.now()]))
  }
  // return res.redirect(`http://localhost:3000${req.path}`)
  return res.redirect(`http://104.198.202.41:3000${req.path}`)
});


const PORT = 3001;
app.on('error', (err) => {
    console.error(`Express server error ${err}`);
});

app.listen(PORT, () => {
    console.info(`magic happens here on port ${PORT}`);
});


function getUserIp(request) {
  let ip = request.headers['x-forwarded-for'] ||
  request.connection.remoteAddress ||
  request.socket.remoteAddress ||
  request.connection.socket.remoteAddress;
  ip = ip.split(',')[0];
  ip = ip.split(':').slice(-1)[0]; //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  return ip;
}
