
const { BadRequestError } = require("../core/error.response");
const { clothing, electronic, product, furniture } = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { findAllDarftForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductsByUser, findProduct, findAllProducts, updateProductById } = require("../models/repositories/product.repo");
const { updateNestedObjectParser, removeUndefinedObject } = require("../utils");

class ProductFactory {
  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).createProduct(); // chỗ này là gọi đến Model con

  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

    return new productClass(payload).updateProduct(productId) // payload ở đây bằng với this
  }

  // QUERY
  static async findAllDarftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDarftForShop({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch })
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb', 'product_shop'] })
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  // create new Product
  async createProduct(productId) {

    //this này là dữ liệu nhận từ payload lên nè
    const newProduct = await product.create({ ...this, _id: productId })

    //khi tạo thành công thì add vào kho hàng tồn

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      })
    }
    return newProduct
  }

  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product })
  }
}

// define sub-class for different product type Clothing
class Clothing extends Product {
  async createProduct() {

    //create trong Model con
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothing) throw new BadRequestError('create new Clothing error');

    //create trong Model cha 

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }

  async updateProduct(productId) {
    // 1. remove attr has null and undefined
    const objectParams = removeUndefinedObject(this)

    // check xem update ở đâu, nếu có product_attributes thì phải update ở cả 2 chỗ, Model Product vs Model con

    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadRequestError('create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this)
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct
  }

}

class Furniture extends Product {
  async createProduct() {
    const newFuniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFuniture) throw new BadRequestError('create new Furniture error');

    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct) throw new BadRequestError('create new Product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this)
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furniture
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct
  }
}

//Register product types

ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;