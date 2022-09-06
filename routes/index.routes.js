const router = require("express").Router();

// ModelsMode
const GameRoomModel = require("../models/GameRoom.model");

// Utils
const { ObjectId } = require("mongoose").Types;
const { getKnownGames } = require("../utils");

// -------------------------- Routes ------------------------ //

/* GET home page */
router.get("/", (req, res) => {
  const { userId } = req.session;

  GameRoomModel.find({ status: { $ne: "finished" } }).then(
    (allGameRoomsFromDB) => {
      allGameRoomsFromDB.sort((a, b) => {
        return b.maxPlayers - a.maxPlayers;
      });

      res.render("index", {
        userId: userId,
        gameRooms: allGameRoomsFromDB,
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
