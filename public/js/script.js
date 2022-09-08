document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Gamelandia JS imported successfully!");
    const firstNew = document.getElementsByClassName("carousel-item")[0];
    firstNew.classList.add("active");
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

const chatDiv = document.getElementById("chat-div");

socket.emit("join", roomId, userId);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
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

socket.on(
  "message",
  ({ content: text, name: username, user, room: roomId }) => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    let p = document.createElement("p");

    li.classList.add("mt-2");
    p.classList.add("m-0", "text-break");

    if (user === userId) {
      span.classList.add("badge", "bg-primary");
    } else {
      span.classList.add("badge", "bg-secondary");
    }

    span.innerText = username;
    p.innerText = text;

    li.appendChild(span);
    li.appendChild(p);

    messages.appendChild(li);
    chatDiv.scrollTo(0, chatDiv.scrollHeight);
  }
);

socket.on("previousMessages", (previousMessages, user) => {
  if (previousMessages.length && user === userId) {
    previousMessages.forEach((message) => {
      let li = document.createElement("li");
      let span = document.createElement("span");
      let p = document.createElement("p");

      console.log(message.user);

      li.classList.add("mt-2");
      p.classList.add("m-0", "text-break");

      if (user === message.user) {
        span.classList.add("badge", "bg-primary");
      } else {
        span.classList.add("badge", "bg-secondary");
      }

      span.innerText = message.name;
      p.innerText = message.content;

      li.appendChild(span);
      li.appendChild(p);

      messages.appendChild(li);
      chatDiv.scrollTo(0, chatDiv.scrollHeight);
    });
    return;
  }
});

// Friends Profile

const friendsProfile = document.getElementById("friends-profile");

// Validate Game on Create Game Room Form
async function validateGame() {
  const game = document.getElementById("game").value;

  if (game === "") return;

  const minPlayers = document.getElementById("minPlayers");
  const maxPlayers = document.getElementById("maxPlayers");

  const gamesJson = await fetch("/games");
  const games = await gamesJson.json();

  const gameInfo = games.find((g) => g.name.match(new RegExp(game, "i")));

  if (!gameInfo) {
    minPlayers.value = 2;
    minPlayers.min = 2;
    minPlayers.removeAttribute("max");

    maxPlayers.value = 2;
    maxPlayers.min = 2;
    maxPlayers.removeAttribute("max");

    return;
  }

  minPlayers.value = gameInfo.minPlayers;
  minPlayers.min = gameInfo.minPlayers;
  minPlayers.max = gameInfo.maxPlayers;

  maxPlayers.value = gameInfo.maxPlayers;
  maxPlayers.min = gameInfo.minPlayers;
  maxPlayers.max = gameInfo.maxPlayers;
}
