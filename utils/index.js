const axios = require("axios");
const { STEAM_API_URL, STEAM_API_KEY, STEAM_ICON_URL } = require("./consts");

async function resolveVanityURL(vanityUrl) {
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
    console.log(error);
  }
}

module.exports = {
  resolveVanityURL,
  getOwnedGames,
};
