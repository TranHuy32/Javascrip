const { model, Schema, Types } = require('mongoose');

const DOCUMENT_TYPE = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema({
  inven_productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  inven_location: {
    type: String,
    default: 'unknow'
  },
  inven_stock: {
    type: Number,
    require: true,
  },
  inven_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  inven_reservation: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = {
  inventory: model(DOCUMENT_TYPE, inventorySchema)
}