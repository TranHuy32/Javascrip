const { Types } = require('mongoose');
const { product } = require('./../product.model');
const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('./../../utils')

const findAllDarftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProductsByUser = async ({ keySearch }) => {
  // đọc thêm về full text search
  const regexSearch = new RegExp(keySearch);
  const result = await product.find({
    isDraft: false,// chỉ sort các sản phẩm đã publish
    $text: { $search: regexSearch }
  }, { score: { $meta: 'textScore' } }) // tìm kiếm chính xác nhất
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return result;
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop), // lấy trong bảng Product đúng shop đúng id
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  
  //modifiedCount hàm của mongo nếu update đc thì sẽ trả về 1 ,ko đc thì 0
  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  //modifiedCount hàm của mongo nếu update đc thì sẽ trả về 1 ,ko đc thì 0

  return modifiedCount
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id)
    .select(unGetSelectData(unSelect))
}

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew
  })
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id') //tham chiều lấy danh sách các trường 
    .sort({ updateAt: -1 })//lấy thằng mới nhất
    .skip(skip)//bỏ qua
    .limit(limit)//lấy bn bản ghi
    .lean()
    .exec()
}

const getProductById = async (productId) => {
  return await product.findOne({
    _id: convertToObjectIdMongodb(productId)
  }).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await getProductById(product.productId);
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}
module.exports = {
  findAllDarftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer
}