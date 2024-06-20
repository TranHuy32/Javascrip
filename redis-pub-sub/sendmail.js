const express = require('express')
const app = express();
const redis = require('redis');
//Tạo subscribe để lắng nghe

const subscribe = redis.createClient()
//đăng kí lắng nghe kênh nào
subscribe.subscribe('ordersystem')
// nhận sự kiện
subscribe.on('message', (channel, message) => {
  console.log('The channel for sendmail' + channel)
  console.log('The message for sendmail:', JSON.parse(message))

})

app.listen(3002, () => {
  console.log('The sendmail app 3002 ')
})