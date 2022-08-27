document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Gamelandia JS imported successfully!");
  },
  false
);

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

socket.on("message", (message) => {
  console.log(message);

  // chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  let li = document.createElement("li");
  e.preventDefault();
  //Get message text
  let msg = e.target.elements.msg.value;

  // let gameRoomId = new URLSearchParams(window.location.).get("id");

  //Emit message to server
  socket.emit("chatMessage", msg);

  chatMessages.appendChild(li).append(msg);

  let span = document.createElement("span");

  chatMessages.appendChild(span);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
