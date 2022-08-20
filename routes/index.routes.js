const router = require("express").Router();
const GameRoom = require("../models/GameRoom.model");

/* GET home page */
router.get("/", (req, res) => {
  GameRoom.find({ status: "waiting" }).then((allGameRoomsFromDB) => {
    // allGameRoomsFromDB.forEach((gameRoom) => {
    //   console.log(gameRoom.status);
    // });

    res.render("index", {
      user: req.session.user,
      gameRooms: allGameRoomsFromDB,
    });
  });
});

module.exports = router;
