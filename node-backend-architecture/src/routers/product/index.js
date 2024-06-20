const express = require('express');

const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))
// authentication
router.use(authenticationV2);

// create
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.put('/published/:id', asyncHandler(productController.publishProductByShop))
router.put('/unpublished/:id', asyncHandler(productController.unPublishProductByShop))

// QUERY
router.get('/draffs/all', asyncHandler(productController.getAllDraffsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router