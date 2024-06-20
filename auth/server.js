const express = require('express');
const app = express();
//Khai bao cac router
const UserRoute = require('./routers/user.route')
//Khai bao MW Log
const createError = require('http-errors')

//khai báo Helmet 

const helmet = require('helmet');
const morgan = require('morgan');

//Khai bai dotenv
require('dotenv').config()
// Apply MongoDB

require('./helpers/connections_mongodb')

const client = require('./helpers/connections_redis')
client.set('foo', 'bar')

client.get('foo',(err, res) => {
  if(err) {
    throw createError.BadRequest()
  }

  console.log(res)
})


app.use(helmet());
app.use(morgan("common"));


app.get('/', (req, res, next) => {
  res.send('home page')
})

//Apply MW bai JSON

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Apply cac router

app.use('/v1/user', UserRoute)

//Khai bao cac middleware

app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist'));
})

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message
  })
})



const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});


// cài đặt nodemon server để refresh mỗi khi có sự thay đổi.

// đường dẫn nào đứng trước nó sẽ ăn vào đường dẫn đó trước.

// luôn luôn để đường dẫn chưa params xuống cuối.