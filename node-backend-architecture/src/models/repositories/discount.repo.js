const {
  getSelectData, unGetSelectData
} = require('./../../utils');
const discount = require('./../discount.model')

const findAllDiscountCodeUnSelect = async ({
  limit = 50, page = 1, sort = 'ctime',
  filter, unSelect, model
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

  return documents;
}

const findAllDiscountCodeSelect = async ({
  limit = 50, page = 1, sort = 'ctime',
  filter, unSelect, model
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean()

  return documents;
}

const updateDiscountCodeById = async ({
  discountId,
  bodyUpdate
}) => {
  return discount.findByIdAndUpdate(discountId, bodyUpdate)
}

const checkDiscountExists = async ({ model, filter }) => {
  const foundDiscount = await model.findOne(filter).lean()
  return foundDiscount
}

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
  updateDiscountCodeById,
  checkDiscountExists
}