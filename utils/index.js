// Modules
const axios = require("axios");
const fs = require("fs");

// Variables
const {
  STEAM_API_URL,
  STEAM_STORE_API_URL,
  STEAM_API_KEY,
  STEAM_ICON_URL,
  STEAM_CLAN_IMG_URL,
} = require("./consts");

// Models
const UserModel = require("../models/User.model");
const GameRoomModel = require("../models/GameRoom.model");
const ChatModel = require("../models/Chat.model");

async function getUserFriendList(user) {
  const { friends, requests } = user;

  const friendsList = await Promise.all(
    friends.map(async (friend) => {
      const friendUser = await UserModel.findById(friend);
      return friendUser;
    })
  );

  const requestsList = await Promise.all(
    requests.map(async (request) => {
      const requestUser = await UserModel.findById(request);
      return requestUser;
    })
  );

  console.log("friendsList:", friendsList);
  console.log("requestsList:", requestsList);

  return { friendsList, requestsList };
}

async function resolveVanityURL(vanityUrl) {
  // If the vanity url doesn't exist, return
  if (!vanityUrl) return;

  try {
    // Get the steam id from the steam vanity url using the steam api
    const { data } = await axios.get(
      `${STEAM_API_URL}/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`
    );
    // Return the steam id
    return data.response.steamid;
  } catch (error) {
    console.log(error);
  }
}

async function getOwnedGames(steamId) {
  // If the steam id doesn't exist, return
  if (!steamId) return;

  // Parameters to get all information about the games the user owns
  const parameters = "include_appinfo=true&include_played_free_games=true";

  try {
    // Get the owned games from the steam id using the steam api
    const { data } = await axios.get(
      `${STEAM_API_URL}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&${parameters}`
    );

    const games = data.response.games;

    games.sort((a, b) => {
      return b.playtime_forever - a.playtime_forever;
    });

    games.forEach((game) => {
      game.img_logo_url = `${STEAM_ICON_URL}${game.appid}/${game.img_icon_url}.jpg`;
    });

    // Return the owned games
    return games;
  } catch (error) {
    // If there is an error, return nothing
    console.log(error);
    return;
  }
}

async function getGameRoomPlayers(gameRoom) {
  const gameRoomPlayers = gameRoom.players;
  let players = [];

  try {
    for (const player of gameRoomPlayers) {
      const user = await UserModel.findById(player);
      players.push(user);
    }

    return players;
  } catch (error) {
    console.log(error);
  }
}

function getKnownGames() {
  const gamesList = fs.readFileSync("./games.json");
  const games = JSON.parse(gamesList).games;

  games.sort(({ name: a }, { name: b }) => {
    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  return games;
}

async function getSuggestedGameRooms(userId) {
  const user = await UserModel.findById(userId);
  const games = getKnownGames();

  if (!user.steamId) return;

  const userOwnedGames = await getOwnedGames(user.steamId);

  const userOwnedKnownGames = userOwnedGames.filter((game) => {
    return games.find((knownGame) => knownGame.appid === game.appid);
  });

  let suggestedGameRooms = [];

  for (const game of userOwnedKnownGames) {
    const gameRoom = await GameRoomModel.findOne({
      game: { $regex: game.name, $options: "i" },
      status: "waiting",
    });

    if (gameRoom) suggestedGameRooms.push(gameRoom);
  }

  return suggestedGameRooms;
}

async function getMessageHistory(roomId) {
  const messages = await ChatModel.find({ room: roomId });

  try {
    messages.forEach(async (message) => {
      message.username = (await UserModel.findById(message.user)).username;
    });

    messages.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
  } catch (error) {
    console.log(error);
  }

  return messages;
}

async function getNewsForAppRandom() {
  const games = getKnownGames();
  let news = [];

  try {
    for (let i = 0; i < 5; i++) {
      let randomGame = games[Math.floor(Math.random() * games.length)];

      if (news.find((game) => game.appid === randomGame.appid))
        while (news.find((game) => game.appid === randomGame.appid))
          randomGame = games[Math.floor(Math.random() * games.length)];

      const { data } = await axios.get(
        `${STEAM_API_URL}/ISteamNews/GetNewsForApp/v2/?appid=${randomGame.appid}`
      );

      const newsData = data.appnews.newsitems[0];
      newsData.game = randomGame.name;

      newsData.banner = newsData.contents.match(
        /{STEAM_CLAN_IMAGE}\/[0-9]{0,}\/[a-zA-z0-9]{0,}.(png|jpg|jpeg)/gm
      );

      if (newsData.banner !== null) {
        newsData.banner = newsData.banner.map((b) => {
          return b.replace("{STEAM_CLAN_IMAGE}", STEAM_CLAN_IMG_URL);
        });
      } else {
        newsData.banner = [await getImageFromApp(randomGame.appid)];
      }

      news.push(newsData);
    }

    return news;
  } catch (error) {
    console.log(error);
  }
}

async function getImageFromApp(appid) {
  if (!appid) return;

  try {
    const { data } = await axios.get(
      `${STEAM_STORE_API_URL}/appdetails?appids=${appid}`
    );

    return data[appid].data.header_image;
  } catch (error) {
    console.log(error);
  }
}

function getAppidFromName(name) {
  const games = getKnownGames();

  const game = games.find((game) => game.name === name);

  if (!game) return;

  return game.appid;
}

module.exports = {
  getUserFriendList,
  resolveVanityURL,
  getOwnedGames,
  getGameRoomPlayers,
  getKnownGames,
  getMessageHistory,
  getNewsForAppRandom,
  getImageFromApp,
  getAppidFromName,
  getSuggestedGameRooms,
};
