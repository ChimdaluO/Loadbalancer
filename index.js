const express = require('express');
const moment = require('moment');

const swStats = require('swagger-stats');
// const apiSpec = require('swagger.json');


const rps = 25;
const app = express();
app.use(express.json({ limit: '400mb' }));
app.use(express.urlencoded({ limit: '400mb', extended: true }));

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
  if(rawData){
    const data = JSON.parse(rawData);

    const result = data.filter(item => {
      return moment(time).subtract(moment(item), 'seconds').seconds() > rps
    })

    if (result.length > rps){
      return res.status(429).json({message: "Request Dropped by IPS"})
    }
    result.push(time)
    client.set(ip, JSON.stringify(result))
    
  }else{
    
    client.set(ip, JSON.stringify([Date.now()]))
  }
  // return res.redirect(`http://localhost:3000${req.path}`)
  return res.redirect(`http://34.133.11.159:3000${req.path}`)
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