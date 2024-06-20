const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const User = require('../model/-user.model')
const { userValidation } = require('../helpers/validation')

const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
const client = require('../helpers/connections_redis');



module.exports = {
  register: async (req, res, next) => {
    try {
      const { error } = userValidation(req.body)

      if (error) {
        throw createError(error.details[0].message)
      }
      const { email, password } = req.body
      const isExits = await User.findOne({ email: email })

      if (isExits) {
        throw createError.Conflict(`${email} already exists`)
      }

      const user = new User({
        email,
        password
      })

      const saveUser = await user.save()

      return res.json({
        status: 'okay',
        element: saveUser
      })

    } catch (error) {
      next(error)

    }

    res.send(' function register')
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest()

      }
      const { userId } = await verifyRefreshToken(refreshToken)
      const accessToken = await signAccessToken(userId)
      const refToken = await signAccessToken(userId)

      res.json({
        accessToken,
        refreshToken: refToken
      })

    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const { error } = userValidation(req.body)

      if (error) {
        throw createError(error.details[0].message)
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        throw createError.NotFound('User not registered')
      }
      
      const isValid = await user.isCheckPassword(password)

      if (!isValid) {
        throw createError.Unauthorized()
      }
      //Lay dc user thi xu li JWT 

      const accessToken = await signAccessToken(user._id)
      const refreshToken = await signRefreshToken(user._id)

      res.send({
        accessToken,
        refreshToken
      })

    } catch (error) {
      next(error)
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest()
      }

      const { userId } = await verifyRefreshToken(refreshToken)

      client.del(userId.toString(), (err, reply) => {
        if (err) {
          throw createError.InternalServerError()
        }
        res.json({
          message: 'Logout'
        })
      })
    } catch (error) {
      next(error)
    }
  },
  getLists: (req, res, next) => {
    const listUser = [
      {
        email: 'thuongtt@edsolabs.com'
      },
      {
        email: 'xuyenbt@gmail.com'
      }
    ]
    res.send({
      listUser
    })
  }
}