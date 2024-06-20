//Khai bao MongoDB
const mongoose = require('mongoose')
const conn = mongoose.createConnection('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

conn.on('connected', function () {
  console.log('Ket noi MongoDB thanh cong')
})

conn.on('disconnected', function () {
  console.log('Huy ket noi')
})

conn.on('error', function (err) {
  console.log(JSON.stringify(err));
})

process.on('SIGINT', async () => {
  await conn.close()
  process.exit(0)
})

module.exports = conn;