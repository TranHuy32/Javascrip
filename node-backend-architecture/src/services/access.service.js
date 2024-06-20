'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
}

class AccessService {
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      //xóa tất cả token trong keyStore
      await KeyTokenService.deleteKeyById(userId)

      throw new ForbiddenError("Something wrong happend !! Pls relogin")
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registed 1')

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registed 2')

    //create 1 cặp mới
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    //update token

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens?.tokens
      },
      $addToSet: {
        refreshTokensUsed: refreshToken //đã được sử dụng để lấy token mới
      }

    })

    return {
      use: { userId, email },
      tokens
    }
  }

  // refreshToken
  /*
  check this token used?
   */

  static handlerRefreshToken = async (refreshToken) => {
    // check xem token này đã được sử dụng chưa 
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    // Nếu có
    if (foundToken) {
      // decode xem la user nao
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)

      //xóa tất cả token trong keyStore
      await KeyTokenService.deleteKeyById(userId)

      throw new ForbiddenError("Something wrong happend !! Pls relogin")
    }
    // Không, Quá ngon
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registed 1')

    //verifyToken
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)

    //check UserId

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registed 2')

    //create 1 cặp mới
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

    //update token


    // await holderToken.updateOne({
    //   $set: {
    //     refreshToken: tokens?.tokens
    //   },
    //   $addToSet: {
    //     refreshTokenUsed: refreshToken //đã được sử dụng để lấy token mới
    //   }

    // })

    return {
      use: { userId, email },
      tokens
    }

  }

  // logout
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }

  // login
  // 1. check email dbs
  // 2. match password
  // 3. create AT vs RT and save 
  // 4. generate token
  // 5 get data and return
  static login = async ({ email, password, refreshToken = null }) => {

    // 1
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw BadRequestError("Shop not registered")

    // 2
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError("Authentication error")

    // 3
    const privateKey = crypto.randomBytes(64).toString("hex")
    const publicKey = crypto.randomBytes(64).toString("hex")

    // 4

    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      userId, refreshToken: tokens?.refreshToken, publicKey, privateKey
    })
    // 5
    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

  //signUp
  static signUp = async ({ name, email, password }) => {

    //Step1 : check email exists ??
    const holderShop = await shopModel.findOne({ email: email }).lean()
    //không sử dụng lean sẽ trả ra Abstract , dùng sẽ trả về 1 JS Obj thuần túy giúp tăng tốc độ query

    if (holderShop) {
      throw new BadRequestError("[ERRORS] ::  Shop already registered !")
    }

    const hasPassword = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name, email, password: hasPassword, roles: [RoleShop.SHOP]
    })



    if (newShop) {

      const privateKey = crypto.randomBytes(64).toString("hex")
      const publicKey = crypto.randomBytes(64).toString("hex")

      // crypto.randomBytes(64).toString('hex')
      //truyền key về cho client 

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop?._id,
        publicKey,
        privateKey
      })



      if (!keyStore) {
        throw new BadRequestError("[ERRORS] ::  keyStore errors !")
      }
      // created token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens
        }
      }
    }
  }

}

module.exports = AccessService