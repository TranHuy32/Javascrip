const mongoose = require('mongoose');

require('dotenv').config();

function newConnection(uri) {
  const conn = mongoose.createConnection(uri, {
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
  return conn;

}

//make connect to DB Test
const testConnection = newConnection(process.env.URI_MONGODB_TEST);
const UserConnection = newConnection(process.env.URI_MONGODB_USER);

module.exports = {
  UserConnection,
  testConnection,
}