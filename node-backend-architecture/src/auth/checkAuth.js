'use strict'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
const { findById } = require('./../services/apiKey.service');

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY].toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    // check objKey

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    //thêm objKey để vào response để chuyển đến MW tiếp theo, cụ thể là check Permission

    req.objKey = objKey
    return next()
  } catch (error) {
    console.log(error)
  }
}

const permission = (permission) => {
  return (req, res, next) => {
    console.log(req.objKey.permissions);
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }

    console.log('Permision:: ', permission);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }

    return next()
  }
}

const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  apiKey,
  permission,
  asyncHandler
}