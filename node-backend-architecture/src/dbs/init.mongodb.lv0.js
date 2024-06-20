const mongoose = require('mongoose');

const connectString = "mongodb://localhost:27017/shopDEV"


mongoose.connect(connectString)
.then(_ => console.log('Connected MongoDB Success PRO'))
.catch(err => console.log(`Error connecting MongoDB : ${err.message}`))