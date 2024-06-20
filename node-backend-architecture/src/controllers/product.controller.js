const { SuccessResponse } = require('../core/success.response');
const ProductService = require('./../services/product.service');
const ProductServiceV2 = require('./../services/product.service.xxx');

class ProductController {

  createProduct = async (req, res, next) => {
    // V1
    // new SuccessResponse({
    //   message: "Create new Product success!",
    //   metadata: await ProductService.createProduct(req.body.product_type,
    //     {
    //       ...req.body,
    //       product_shop: req.user.userId
    //     })

    // }).send(res)

    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type,
        {
          ...req.body,
          product_shop: req.user.userId
        }

      )
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product Success',
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }


  // QUERY
  getAllDraffsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Draffs For Shop success!",
      metadata: await ProductServiceV2.findAllDarftsForShop({ product_shop: req.user.userId })

    }).send(res)

  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Publish For Shop success!",
      metadata: await ProductServiceV2.findAllPublishForShop({ product_shop: req.user.userId })

    }).send(res)

  }

  //PUT

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: " Publish Product By Shop success!",
      metadata: await ProductServiceV2.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })

    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: " ubPublish Product By Shop success!",
      metadata: await ProductServiceV2.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })

    }).send(res)
  }

  //SEARCH
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search success",
      metadata: await ProductServiceV2.searchProducts(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list findAllProducts success',
      metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findProduct Success',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
}

module.exports = new ProductController()