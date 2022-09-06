const app = require("./app");
const GameRoom = require("./models/GameRoom.model");
const ChatModel = require("./models/Chat.model");
const dbConnection = require("./db/index.js");
const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

// Socket.io config:
const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/messages");
// app.set("socketio", io);

io.on("connection", (socket) => {
  // socket.emit("id", socket.id); // send each client their socket id
  socket.on("join", (room) => {
    socket.join(room);
    ChatModel.find({ room: room }).then((result) => {
      io.to(room).emit("previousMessages", result);
      console.log(result);
    });
    // console.log(room);
  });

  // socket.on("kickedPlayer", (user) => {
  //   console.log(user);
  // });

  // //Runs when player joins the game room
  // socket.broadcast.emit("message", "A user has joined the room");

  // let currentGameRoomIdUrl = socket.handshake.headers.referer.split("/")[4];
  // if (!currentGameRoomIdUrl) {
  //   return;
  // }
  // // console.log(ObjectId(currentGameRoomIdUrl));
  // GameRoom.findById(ObjectId(currentGameRoomIdUrl)).then((gameRoom) => {
  //   if (!gameRoom) {
  //     socket.disconnect();
  //     return;
  //   }
  //   // console.log(ObjectId(currentGameRoomIdUrl));
  //   // console.log(gameRoom._id);
  //   if (ObjectId(currentGameRoomIdUrl) !== gameRoom._id) {
  //     socket.disconnect();
  //     return { err: "ns not provided" };
  //   }
  socket.on("chatMessage", (data) => {
    let messageAttributes = {
      content: data.content,
      name: data.name,
      user: data.user,
      room: data.room,
    };
    // console.log(messageAttributes);
    const message = new ChatModel(messageAttributes);
    message
      .save()
      .then(() => {
        io.to(data.room).emit("message", messageAttributes);
      })
      .catch((error) => console.log(`error: ${error.message}`));
  });
  // console.log(room);
  // io.emit("message", formatMessage("username", msg));
  // console.log(gameRoom._id);

  // //Runs when player leaves the game room
  // socket.on("disconnect", () => {
  //   io.emit("message", "A user has left the room");
  // });
});
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
