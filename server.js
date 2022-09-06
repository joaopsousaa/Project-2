const app = require("./app");

// Socket.io config:
const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/messages");

io.on("connection", (socket) => {
  //Runs when player joins the game room
  socket.broadcast.emit("message", "A user has joined the chat");

  //Runs when player leaves the game room
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the room");
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("username", msg));
  });
});
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
