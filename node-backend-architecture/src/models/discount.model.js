const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';
const discountSchema = new Schema({
  discount_name: {
    type: String,
    required: true
  },
  discount_description: {
    type: String,
    required: true
  },
  discount_type: {
    type: String,
    default: 'fixed_amount' //percentage
  },
  discount_value: { // 10.000, 10
    type: Number,
    required: true
  },
  discount_code: { // discount code
    type: String,
    required: true
  },
  discount_start_date: { // ngay bat dau
    type: Date,
    required: true
  },
  discount_end_date: { // ngay ket thuc
    type: Date,
    required: true
  },
  discount_max_uses: { // so luong discount duoc ap dung
    type: Number,
    required: true
  },
  discount_uses_count: { // so discount da su dung
    type: Number,
    required: true
  },
  discount_users_used: { // ai da dung
    type: Array,
    default: []
  },
  discount_max_uses_per_user: { // so luong cho phep toi da dung
    type: Number,
    required: true
  },
  discount_min_order_value: {
    type: Number,
    required: true
  },
  discount_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },

  discount_is_active: {
    type: Boolean,
    default: true
  },
  discount_applies_to: {
    type: String,
    required: true,
    enum: ['all', 'specific']
  },
  discount_product_ids: { // so san pham duoc ap dung
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);

//giá trị tối thiểu đc giảm giá, giảm giá theo các danh mục, khu vực mùa bla :D
