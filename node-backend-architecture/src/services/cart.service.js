'use strict'

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/*
    Key feature: cart service
    - add product to cart [User]
    - reduce product to cart [User]
    - increase quantity by one [User]
    - get cart [User]
    - Delete cart [User]
    - Delete cart item [User]
*/


class CartService {


  // repo

  static async createUserCart({ userId, product = {} }) {

    const query = {
      cart_userId: userId,
      cart_state: "active"
    }, updateOrInsert = {
      $addToSet: {
        cart_products: product
      }
    }, options = {
      upsert: true, new: true,
    }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)

  }

  static async updateUserCartQuantity({ userId, product = {} }) {
    const { productId, quantity } = product;

    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: "active"
    }, updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity //Dấu $ đại diện cho việc tìm kiếm và update chính option đó
      }
    }, options = {
      upsert: true, new: true,
    }

    return await cart.findOneAndUpdate(query, updateSet, options)

  }
  // end repo

  static async addToCart({ userId, product = {} }) {
    // check cart 
    const userCart = await cart.findOne({
      cart_userId: userId
    })
    console.log("userCart:", userCart)
    if (!userCart) {
      //create cart for user
      return await CartService.createUserCart({ userId, product })
    }
    // if cart is exist but it is empty
    if (!userCart.cart_count_product.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // if cart is exist and has product
    return await CartService.updateUserCartQuantity({ userId, product })
  }

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
          quantity,
          price,
          shopId,
          old_quantity,
          productId
          }
        ],
        versions
      }
    ]
   */

  static async addToCartV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError('')

    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop')
    }

    if (quantity === 0) {
      // deleted
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteItemInCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }

    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({
      cart_userId: +userId
    }).lean()
  }

}

module.exports = CartService