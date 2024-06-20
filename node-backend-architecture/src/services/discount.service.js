'use strict'

// Discount Servive
// 1 Generator Discount Code (Shop|Admin(Global))
// 2 Get Discount Amount[USER]
// 3 Get All Discount Code[USER|Shop]
// 4 Verify discount code[[USER]
// 5 Delete Discount Code[Admin|Shop]
// 6 Cancel Discount Code[USER]

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require('./../models/repositories/product.repo');
const discount = require('./../models/discount.model');
const { findAllDiscountCodeUnSelect, findAllDiscountCodeSelect, updateDiscountCodeById, checkDiscountExists } = require("../models/repositories/discount.repo");
class DiscountService {
  static async createDiscountCode(payload) {

    console.log("646842abbca37137a99f1a00:", payload)
    const {
      code,
      start_date,
      end_date,
      is_active,
      users_used,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user
    } = payload;

    // check date
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError('Discount code has expried');
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date')
    }

    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()


    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists!')
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    });

    return newDiscount
  }

  static async updateDiscountCode(discountId, bodyUpdate) {
    return await updateDiscountCodeById(discountId, bodyUpdate)
  }

  // Get all discount codes available with products: Lấy các sản phẩm đã được áp đụng mã khuyến mãi
  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('discount not exists')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let filter
    if (discount_applies_to === 'all') {
      // get all
      filter = {
        product_shop: convertToObjectIdMongodb(shopId),
        isPublished: true
      }
    }

    if (discount_applies_to === 'specific') {
      // get by product ids
      filter = {
        _id: { $in: discount_product_ids },
        isPublished: true
      }
    }

    const products = await findAllProducts({
      filter,
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name']
    })

    return products
  }

  // get all discount code of shop: lấy mã khuyến mãi của shop

  static async getAllDiscountCodeByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount
    })

    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })
    if (!foundDiscount) throw new NotFoundError('Discount does not exist')

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_value,
      discount_type
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError('discount expried')
    if (!discount_max_uses) throw new NotFoundError('discount are out')
    // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
    //   throw new NotFoundError('discount ecode has expried')
    // }

    // check maximum value xem có set giá trị min của đơn hàng để áp dụng không

    let totalOrder = 0
    if (discount_min_order_value > 0) {
      // get total : nếu có thì lấy giá trị sau đó tính tổng (chỗ này sau này thao tác check lại Sản phẩm)
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`)
      }
    }

    // trường hợp số lần đc sử dụng code tối đa

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUserDiscount) {
        // TODO
      }
    }
    //xem trường này là tiền cố định hay lấy theo % tổng giá trị

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      tottalPrice: totalOrder - amount
    }
  }


  // Không có khái niệm xóa hoàn toàn
  // Nên đưa vào 1 history để sau này tiện xem lại

  static async deleteDiscountCode({ shopId, codeId }) {

    // tìm xong mới xóa() => thực hiện 1 số bổ sung

    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })


    return deleted
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('discount does not exist')

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })

    return result
  }
}


module.exports = DiscountService