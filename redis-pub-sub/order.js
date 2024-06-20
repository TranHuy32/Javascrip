const express = require('express')
const app = express();
const redis = require('redis');

//tạo các publish để push/ nhận ở 2 service còn lại

const publish = redis.createClient()

app.get('/order', (req, res, next) => {
  const order = [{
    productId: 1,
    price: 5000
  }, {
    productId: 2,
    price: 10000
  }]

  // Đoạn này gửi sang service Payment + Sendmail
  publish.publish("ordersystem", JSON.stringify(order))

  res.json({
    status: 200,
    message: 'Order Thanks'
  })
})

app.listen(3000, () => {
  console.log('The order app 3000')
})