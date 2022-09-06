document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Gamelandia JS imported successfully!");
  },
  false
);

const socket = io();

const messages = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const kickPlayer = document.getElementById("kick-player");
const input = document.getElementById("msg");
const inputUserId = document.getElementById("chat-user-id");
const inputUserName = document.getElementById("chat-user-name");
const chatField = document.getElementById("chat-msg-field");
const inputGameRoomId = document.getElementById("chat-gameroom-id");
let roomId = inputGameRoomId.value;
let userId = inputUserId.value;

// let displayMessage = (message) => {
//   $("#chat").prepend(
//     $("<li>").html(`
// <div class="message ${getCurrentUserClass(message.user)}">
// ${message.content}
// </div>`)
//   );
// };

// let getCurrentUserClass = (id) => {
//   let userId = inputUserId.value;
//   return userId === id ? "current-user" : "";
// };
// socket.on("id", (socketId) => {
//   inputUserId.value = socketId;
// });

socket.emit("join", roomId);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // const gameRoomId = window.location.pathname.split("/")[2];
  let text = input.value;
  console.log(text);
  userId = inputUserId.value;
  let userName = inputUserName.value;
  roomId = inputGameRoomId.value;
  //Get message text
  if (text) {
    //Emit message to server
    socket.emit("chatMessage", {
      content: text,
      name: userName,
      user: userId,
      room: roomId,
    });
    console.log({ content: text, name: userName, user: userId, room: roomId });
    input.value = "";
  }
});

socket.on("message", (messageAttributes) => {
  let li = document.createElement("li");
  li.textContent = `${messageAttributes.name}: ${messageAttributes.content}`;
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
  // console.log(gameRoomId);
});

socket.on("previousMessages", (previousMessages) => {
  if (previousMessages) {
    console.log("Aquiiiiii");
    previousMessages.forEach((message) => {
      console.log(message);
      let li = document.createElement("li");
      li.textContent = `${message.name}: ${message.content}`;
      messages.appendChild(li);
      window.scrollTo(0, document.body.scrollHeight);
    });
    return;
  }
  // let li = document.createElement("li");
  // li.textContent = previousMessages.message;
  // messages.appendChild(li);
  // window.scrollTo(0, document.body.scrollHeight);
  // console.log(previousMessages);
});

// kickPlayer.addEventListener("click", (e) => {
//   e.preventDefault();
//   let userToBeKickedId = kickPlayer.getAttribute("href").split("/")[2];
//   socket.emit("kickedPlayer", userToBeKickedId);
// });
