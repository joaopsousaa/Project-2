// Modules
const axios = require("axios");
const fs = require("fs");

// Variables
const { STEAM_API_URL, STEAM_API_KEY, STEAM_ICON_URL } = require("./consts");

// Models
const UserModel = require("../models/User.model");

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

module.exports = {
  resolveVanityURL,
  getOwnedGames,
  getGameRoomPlayers,
  getKnownGames,
};
