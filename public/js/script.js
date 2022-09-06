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
const input = document.getElementById("msg");
const inputUserId = document.getElementById("chat-user-id");
const inputUserName = document.getElementById("chat-user-name");
const chatField = document.getElementById("chat-msg-field");
const inputGameRoomId = document.getElementById("chat-gameroom-id");
let roomId = inputGameRoomId.value;

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
socket.emit("join", roomId);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // const gameRoomId = window.location.pathname.split("/")[2];
  let text = input.value;
  console.log(text);
  let userId = inputUserId.value;
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

socket.on(
  "message",
  ({ content: text, name: userName, user: userId, room: roomId }) => {
    let li = document.createElement("li");
    let strong = document.createElement("strong");
    strong.textContent = userName;
    li.textContent = text;
    messages.appendChild(li).appendChild(strong);
    window.scrollTo(0, document.body.scrollHeight);
    // console.log(gameRoomId);
  }
);

socket.on("previousMessages", (previousMessages) => {
  if (previousMessages.length) {
    previousMessages.forEach((message) => {
      let li = document.createElement("li");
      li.textContent = message.message;
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

// Validate Game on Create Game Room Form
async function validateGame() {
  const game = document.getElementById("game").value;

  if (game === "") return;

  const minPlayers = document.getElementById("minPlayers");
  const maxPlayers = document.getElementById("maxPlayers");

  const gamesJson = await fetch("/games");
  const games = await gamesJson.json();

  const gameInfo = games.find((g) => g.name.match(new RegExp(game, "i")));

  if (!gameInfo) return;

  console.log(minPlayers.value);

  minPlayers.value = gameInfo.minPlayers;
  minPlayers.min = gameInfo.minPlayers;
  minPlayers.max = gameInfo.maxPlayers;

  maxPlayers.value = gameInfo.maxPlayers;
  maxPlayers.min = gameInfo.minPlayers;
  maxPlayers.max = gameInfo.maxPlayers;

  console.log(gameInfo);
}
