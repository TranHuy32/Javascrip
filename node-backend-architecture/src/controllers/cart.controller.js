const CartService = require('./../services/cart.service');
const { SuccessResponse } = require('./../core/success.response');


class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart Success',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Cart Success",
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Deleted Cart Success',
      metadata: await CartService.deleteItemInCart(req.body)
    }).send(res)
  }

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Cart Success',
      metadata: await CartService.getListUserCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController()