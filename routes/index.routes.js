const router = require("express").Router();
const GameRoomModel = require("../models/GameRoom.model");

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

module.exports = router;
