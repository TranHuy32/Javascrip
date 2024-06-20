'use strict'

const mongoose = require('mongoose')
const os = require('os');

const process = require('process')

const _SECONDS = 5000;



const countConnect = () => {
  const numConnection = mongoose.connect.length
  console.log("Number of connections:: ", numConnection)
}

const checkOverload = () => {

  setInterval(() => {
    const numberConnection = mongoose.connections.length // có bao nhiêu kết nối
    const numberCores = os.cpus.length // Có bao nhiêu luồng
    const memoryUsage = process.memoryUsage().rss // bố nhớ đang được sử dụng
    const maxcores = numberCores * 5; // vd: 1 luồng có thể duy trì 5 connect => tính ra số lượng kết nối có thể chịu tải
    console.log(`Số lượng kết nối hiện tại : ${numberConnection}`)
    console.log(`Bộ nhớ còn lại : ${memoryUsage / 1024 / 1024} MB,numberCores: ${numberCores} `)
    if (maxcores > numberConnection) {
      console.log(`Số lượng connect quá tải`)

      // send 1 cái gì đó để cho anh em trong Team biết
    }
  }, _SECONDS);

}

module.exports = {
  countConnect,checkOverload
}