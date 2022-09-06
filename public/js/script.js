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
