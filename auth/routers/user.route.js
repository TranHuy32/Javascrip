//Khai bao 1 router
const express = require('express');
const router = express.Router();
const {  verifyAccessToken } = require('../helpers/jwt_service');
const UserController = require('../controllers/user.controller')

router.post('/register',UserController.register )

router.post('/refresh-token',UserController.refreshToken)

router.post('/login',UserController.login)

router.post('/logout',UserController.logout)

router.post('/getlist', verifyAccessToken,UserController.getLists)

module.exports = router;