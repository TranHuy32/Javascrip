"use strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquiredLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`; //NGƯỜI MUA VÀO SẼ ĐƯỢC 1 KHÓA ĐẾN KHI XỬ LÍ XONG CHO NGƯỜI ĐÓ MỚI ĐẾN NGƯỜI TIẾP THEO
  const retryTimes = 10;
  const expireTime = 3000; // 3s

  for (let index = 0; index < retryTimes; index++) {
//TỌA 1 KEY, THẰNG NÀO NẮM GIỮ ĐƯỢC VÀO THANH TOÁN

    const result = await setnxAsync(key, expireTime);

    // THÀNH CÔNG = 1, SAI BẰNG O

    if (result === 1) {
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const deleteAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await deleteAsyncKey(keyLock);
};

module.exports = {
  acquiredLock,
  releaseLock,
};