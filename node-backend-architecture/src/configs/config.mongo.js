'user strick'
require('dotenv').config();


const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT || '3000')
  },
  db: {
    host: process.env.DEV_DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DEV_DB_PORT || '27017'),
    name: process.env.DEV_DB_NAME || 'shopDEV',
    // use: process.env.DEV_DB_USER,
    // pass: process.env.DEV_DB_PASSWORD
  },
  jwt: {
    // secretKey: process.env.DEV_SECRETKEY
  }
};


const pro = {
  app: {
    port: parseInt(process.env.PRO_APP_PORT || '3005')
  },
  db: {
    host: process.env.PRO_DB_HOST || '127.0.0.1',
    port: parseInt(process.env.PRO_DB_PORT || '2707'),
    name: process.env.PRO_DB_NAME || 'shopPRO',
    // use: process.env.PRO_DB_USER,
    // pass: process.env.PRO_DB_PASSWORD
  },
  jwt: {
    // secretKey: process.env.PRO_SECRETKEY
  }
};



const config = {
  dev,
  pro,
};
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env] 