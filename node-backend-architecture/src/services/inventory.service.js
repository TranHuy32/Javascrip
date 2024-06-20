const { getProductById } = require('./../models/repositories/product.repo')
const { BadRequestError } = require('./../models/repositories/product.repo');
const { inventory } = require('./../models/inventory.model')

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = 'TP HN'
  }) {
    const product = await getProductById(productId)
    if (!product) {
      throw new BadRequestError('The product does not exists')
    }

    const query = { inven_shopId: shopId, ivent_productId: productId }
    const updateSet = {
      $inc: {
        inven_stock: stock
      },
      $set: {
        inven_location: location
      }
    }
    const options = {
      upsert: true, new: true
    }

    return await inventory.findOneAndUpdate(query, updateSet, options)
  }
}

module.exports = InventoryService