const router = require("express").Router();
const GameRoomModel = require("../models/GameRoom.model");

// -------------------------- Routes ------------------------ //

/* GET home page */
router.get("/", (req, res) => {
  const { userId } = req.session;
  GameRoomModel.find({ status: "waiting" }).then((allGameRoomsFromDB) => {
    // allGameRoomsFromDB.forEach((gameRoom) => {
    //   console.log(gameRoom.status);
    // });

    res.render("index", {
      userId: userId,
      gameRooms: allGameRoomsFromDB,
    });
  });
});

module.exports = router;
