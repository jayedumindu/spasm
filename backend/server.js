const { Server } = require("socket.io");
// require("./peer")?

const io = new Server(3080, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id)

  socket.on("send-message", (data) => {
    console.log(data);
  });

  socket.on("user-connected", (userId) => {
    // socket.join(roomId);
    socket.broadcast.emit("user-connected", userId);
    console.log("new user awoooooo!!!")
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userId);
    });
  });
});

// const myPeer = new Peer(undefined, {
//   host: "/",
//   port: "3002",
// });


