'use strict'

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {

    try {

      // leve0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // return tokens ? tokens?.publicKey : null

      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
      //tìm hiều Atomic
      return tokens ? tokens?.publicKey : null
    } catch (error) {
      return error
    }

  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId })
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id)
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId })
  }

  static findByRefreshTokenAndUpdate = async (userId, refreshToken) => {
    return await keytokenModel.updateOne({ user: userId }, { $push: { refreshTokensUsed: refreshToken }, refreshToken },)
  }

}

module.exports = KeyTokenService