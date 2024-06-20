const JWT = require('jsonwebtoken')
require('dotenv')
const createError = require('http-errors')

const client = require('../helpers/connections_redis')

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: userId,
    }
    const secret = process.env.ACCESS_TOKEN_SECRET

    const options = {
      expiresIn: '2h' //1h
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

const verifyAccessToken = async (req, res, next) => {
  if (!req.headers['authorization']) {
    return next(createError.Unauthorized())
  }
  const authHearder = req.headers['authorization']
  const bearerToken = authHearder.split(' ')
  const token = bearerToken[1]
  //start verify token

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(createError.Unauthorized())
      }
      return next(createError.Unauthorized(err.message))
    }
    req.payload = payload
    next()
  })
}

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: userId,
    }
    const secret = process.env.REFRESH_TOKEN_SECRET

    const options = {
      expiresIn: '1y' //1h
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err)
      }
      client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
        if (err) {
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  })
}
const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return reject(err)
      }
      client.get(payload.userId, (err, reply) => {
        if (err) {
          return reject(createError.InternalServerError())
        }
        if (refreshToken === reply) {
         return resolve(payload)
        }
        return reject(createError.Unauthorized())
      })
    })
  })
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}