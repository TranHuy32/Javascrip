const express = require('express')
const app = express();

const EventEmitter = require('events')

//Áp dụng : + Lưu các lỗi lập trình vào trong 1 file, đẩy đi đâu đó để theo dõi
// Người dùng order 1 sản phẩm sau đó mình đẩy sản phẩm đó đi đâu==> báo về email

const myEvent = new EventEmitter()

//Listening Event
myEvent.on('geterror', (err1, err2) => {
  console.log("Errors:", err1, err2)

  //Dùng winston để ghi lại log
})

//Emit event

setTimeout(() => {
  myEvent.emit("geterror", { msg: "Lỗi rồi check lại đi nhé ! " })
}, 2000)


app.listen(3000, () => {
  console.log('The order app 3000')
})