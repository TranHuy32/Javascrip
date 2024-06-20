const express = require("express")
const app = express()

//sử dụng apache benchmark test tool ==> có thể chứng minh rằng cùng 1 thời điểm có thể có rất nhiều request

// syntax:
// ab -n -c url
// -n Số lượng request
// -c Số lượng request cùng 1 thời điểm

app.get('/order', (req, res) => {
  const time = new Date().getTime()

  console.log(`Time request::::${time}`)

  //Giả sử số lượng tồn kho là 10
  const slTonKho = 10;

  //Tên của sản phẩm là IP13
  const keyName = "ip13"

  //Giả sử mỗi lần mua thì số lượng tồn kho giảm đi 1
  const slMua = 1;

  //Số lượng đã bán ra , nếu chưa bán thì set = 0 còn nếu bán thì update + 1 mỗi lần user order thành công !

  return res.json({
    status: 200,
    msg: "OK",
    time
  })
})

app.listen(3000, () => {
  console.log("The server running at port 3000")
})