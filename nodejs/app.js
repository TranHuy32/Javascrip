const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const createErrors = require('http-errors');
const logEvents = require('./helpers/log-events');
const {v4:uuid} = require('uuid');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.use((req, res, next) => {

  console.log('fdfndjnfdj')
  // res.status(404);
  // res.json({
  //   status: 404,
  //   message: 'Not found url!',
  //   links: {
  //     docs: 'https://docs.google.com/'
  //   }
  // });
  next(createErrors(404, 'Not found url!'));
});

app.use((err, req, res, next) => {
  logEvents(`idErrors----${uuid()}----${req.url}----${req.method}----${err.message}`);
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message
  });
});

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mern-eshop'
  })
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log('server is running http://localhost:3000');
});
