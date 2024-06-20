'use strict'

const { order } = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkoutProductServer, checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")

class CheckoutService {

  // login và chưa login

  // {
  //   cartId,
  //   userId,
  //   shop_order_ids:[{
  //     shopId,
  //     shop_discounts:[{shopId, discountId,codeId}], 
  //     item_products:[
  //       {
  //       price,
  //       quantity,
  //       productId
  //       }
  //     ]
  //   }]
  // }
  static async checkoutReview({
    cartId, userId, shop_order_ids,
  }) {

    // check cartId có tồn tại hay không
    const foundCart = await findCartById(cartId)

    if (!foundCart) throw new BadRequestError("Cart does not exits !")
    const checkout_order = {
      totalPrice: 0, // tong tien hang
      feeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0 // tong thanh toan
    }

    const shop_order_ids_new = []

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      //check product avaiable
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
      // checkout product available
      const checkProductServer = await checkProductByServer(item_products)

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong !!!")

      //Tổng tiền đơn hàng

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      //Tổng tiền trước khi xử lí
      checkout_order.totalPrice = + checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        //get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })
        // tong cong discount giam gia
        checkout_order.totalCheckout += discount
        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }

  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    })

    // check lai gia 1 lan xem co vuot ton kho hay khong
    // get new array products 
    const products = shop_order_ids_new.flatMap(order => order.item_products)
    console.log(`[1]:`, products);
    const acquireProduct = []
    for (let i = 0; i < products.length ; i ++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if(keyLock) {
        await releaseLock(keyLock)
      }
    }

    // check if co mot san hey hang trong
    if(acquireProduct.includes(false)) {
      throw new BadRequestError('Mot san pham da duoc cap nhat, vui long quay lai gio hang')
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })
    // create thanh cong thi remove product trong cart
    if(newOrder) {
      // remove product in my cart
    }
    return newOrder 
  }

  static async getOrderByUser() {

  }

  static async getOneOrderByUser() {
    
  }

  static async cancelOrderByUser() {
    
  }

  static async updateOrderStatusByShop() {
    
  }
  


}
module.exports = CheckoutService