const router = require("express").Router();

// ModelsMode
const GameRoomModel = require("../models/GameRoom.model");

// Utils
const { ObjectId } = require("mongoose").Types;
const {
  getKnownGames,
  getNewsForAppRandom,
  getImageFromApp,
} = require("../utils");

// -------------------------- Routes ------------------------ //

/* GET home page */
router.get("/", async (req, res) => {
  const { userId } = req.session;
  const news = await getNewsForAppRandom();
  const image = await getImageFromApp(730);

  console.log(image);

  GameRoomModel.find({ status: { $ne: "finished" } }).then(
    (allGameRoomsFromDB) => {
      allGameRoomsFromDB.sort((a, b) => {
        return b.maxPlayers - a.maxPlayers;
      });

      res.render("index", {
        userId: userId,
        gameRooms: allGameRoomsFromDB,
        news,
      });
    }
  );
});

// GET /games --> Get known games (front-end only)
router.get("/games", (req, res) => {
  const games = getKnownGames();
  return res.status(200).json(games);
});

module.exports = router;
