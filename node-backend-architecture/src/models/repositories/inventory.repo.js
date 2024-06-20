const { convertToObjectIdMongodb } = require('../../utils');
const { inventory } = require('./../inventory.model');
const { Types } = require('mongoose');

const insertInventory = async ({ productId, shopId, stock, location = 'unknow' }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId
  })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
  const query = {
    inven_productId: convertToObjectIdMongodb(productId),
    inven_stock: { $gte: quantity }
  }
  const updateSet = {
    $inc: { // GIẢM, TRỪ ĐI SỐ LƯỢNG ĐÃ MUA
      inven_stock: -quantity
    },
    $push: {
      inven_reservations: { // CẬP NHẬP LẠI THÔNG TIN ĐỂ CHECK XEM GIỎ HÀNG NÀO MUA, MUA LÚC NÀO SỐ LƯỢNG BAO NHIÊU
        quantity,
        cartId,
        // TODO date
      }
    }
  }
  const options = {
    upsert: true, new: true
  }
  return await inventory.updateOne(query, updateSet)
}

module.exports = {
  insertInventory,
  reservationInventory
}