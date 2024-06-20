const { SuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount.service');
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Discount Success',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Discount Codes success',
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Discount Amount success',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Discount code with products success",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }
}

module.exports = new DiscountController()