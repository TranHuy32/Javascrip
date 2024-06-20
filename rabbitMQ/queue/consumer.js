const amqplib = require('amqplib')

// .env
const amqp_url_cloud = "amqps://dxdphroh:GRqbRqmq3fDQjK8Q1PTZS8FurYsMkZ8e@armadillo.rmq.cloudamqp.com/dxdphroh"
const amqp_url_docker = ""

//Send MS

const receiveQueue = async () => {
  try {
    // 1.Create connect

    const conn = await amqplib.connect(amqp_url_cloud)

    // 2.Create channel

    const channel = await conn.createChannel()

    // 3.Create name Queue

    const nameQueue = "q1"

    // 4.Tạo hàng đợi

    await channel.assertQueue(nameQueue, {
      durable: false //tính bền bỉ : máy chủ crash lỗi thì nó sẽ mất hàng đợi
    })

    // 5.receice Queue

    await channel.consume(nameQueue, msg => {
      console.log("MSG:::::", msg.content.toString())
    },
      { noAck: true }

      // xác nhận đã nhận hàng hay chưa (nếu chưa xác nhận đã xử lí nó sẽ tiếp tục xử lí các message khi có consumer lắng nghe, 5 consumer đều cũng sẽ nhận đc)
      // nếu lỗi và vẫn chả về như vậy sẽ đầy hạng đợi thì sao
    )

    //Buffer là gì : Vận chuyển dữ liệu bằng byte nhanh hơn Obj và kí tự bình thường && mã hóa thông điệp bằng byte

    // 6 .Close conn && channel


  } catch (error) {
    console.error("Erorrs:", error.message)
  }
}

receiveQueue()