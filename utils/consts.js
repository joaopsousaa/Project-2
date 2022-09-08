const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/gamelandia";
const STEAM_API_URL = "https://api.steampowered.com";
const STEAM_STORE_API_URL = "https://store.steampowered.com/api";
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ICON_URL =
  "http://media.steampowered.com/steamcommunity/public/images/apps/";
const STEAM_CLAN_IMG_URL =
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans";

module.exports = {
  MONGO_URI,
  STEAM_API_URL,
  STEAM_STORE_API_URL,
  STEAM_API_KEY,
  STEAM_ICON_URL,
  STEAM_CLAN_IMG_URL,
};
