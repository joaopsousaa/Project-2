const app = require("./app");

const ChatModel = require("./models/Chat.model");

// Socket.io config:
const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const { getMessageHistory } = require("./utils");
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("join", (room, user) => {
    socket.join(room);
    getMessageHistory(room).then((messages) => {
      socket.emit("previousMessages", messages, user);
    });
  });

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
});

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
