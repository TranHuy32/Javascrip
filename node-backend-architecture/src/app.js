require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
//Khai báo dotenv

const app = express()

// console.log('Process::', process.env)

//Init middlewares

app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// morgan("dev"):dev
// morgan("compiled"):production
// morgan("common")
// morgan("short")
// morgan("tiny")

//Init DB

require('./dbs/init.mongodb')

const { countConnect, checkOverload } = require('./helpers/check.connect')
// countConnect()
// checkOverload()

//Init Rourte

app.use('', require('./routers'))



// handling error
// MW
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.stattus = 404;
  next(error)
})

// Xử lí lỗi 
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack:error.stack,
    message: error.message || 'Internal Server Error'
  })
})


module.exports = app