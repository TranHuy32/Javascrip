const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommere start with ${PORT}`)
})

//gọi tiến trình này khi CTRL + C
process.on("SIGINT", () => {
  server.close(() => console.log("Exit server Express"))

  //Xử lí 1 số vấn đề để thông báo là Server bị Crash
})