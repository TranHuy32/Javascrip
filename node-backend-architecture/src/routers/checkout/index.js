const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./../../auth/checkAuth');
const checkoutController = require('./../../controllers/checkout.controller');

router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router;