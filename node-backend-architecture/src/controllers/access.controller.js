'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const accessService = require("../services/access.service");


class AccessController {

  handlerRefreshToken = async (req, res, next) => {

    // new SuccessResponse({
    //   message: 'Get token success !',
    //   metadata: await accessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res)

    // v2

    new SuccessResponse({
      message: 'Get token success !',
      metadata: await accessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res)
  }

  logout = async (req, res, next) => {

    new SuccessResponse({
      message: 'Logout success !',
      metadata: await accessService.logout(req.keyStore),
    }).send(res)
  }

  login = async (req, res, next) => {

    new SuccessResponse({
      metadata: await accessService.login(req.body),
    }).send(res)
  }

  signUp = async (req, res, next) => {

    new CREATED({
      message: 'Regiserted OK!',
      metadata: await accessService.signUp(req.body),
      options: {
        limit: 10,
      }
    }).send(res)

  }
}

module.exports = new AccessController()