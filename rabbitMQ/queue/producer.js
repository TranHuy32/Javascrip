const amqplib = require('amqplib')

// .env
const amqp_url_cloud = "amqps://dxdphroh:GRqbRqmq3fDQjK8Q1PTZS8FurYsMkZ8e@armadillo.rmq.cloudamqp.com/dxdphroh"
const amqp_url_docker = ""

//Send MS

const sendQueue = async ({ msg }) => {
  try {
    // 1.Create connect

    const conn = await amqplib.connect(amqp_url_cloud)

    // 2.Create channel

    const channel = await conn.createChannel()

    // 3.Create name Queue

    const nameQueue = "q1"

    // 4.Tạo hàng đợi

    await channel.assertQueue(nameQueue, {
      durable: false //tính bền bỉ : máy chủ crash lỗi thì nó sẽ mất hàng đợi , nếu true sẽ ko mất hàng đợi
    })

    // 5.Send Queue

    await channel.sendToQueue(nameQueue, Buffer.from(msg), {
      expiration: "10000", //TTL - time-to-live set thời gian hết hạn, nếu consumer bị lỗi hoặc không xử lí thì message sẽ tự động biến mất khỏi hàng đợi,
      persistent: true, //lấy data ở ổ đĩa ra để sử dụng nếu cache ko tồn tại
    })

    //Buffer là gì : Vận chuyển dữ liệu bằng byte nhanh hơn Obj và kí tự bình thường && mã hóa thông điệp bằng byte

    // 6 .Close conn && channel


  } catch (error) {
    console.error("Erorrs:", error.message)
  }
}

sendQueue({ msg: "Hello anh em" })