const router = require("express").Router();
const GameRoom = require("../models/GameRoom.model");

/* GET home page */
router.get("/", (req, res, next) => {
  GameRoom.find().then((allGameRoomsFromDB) => {
    res.render(
      "index",
      // { user: req.session.user },
      { gameRooms: allGameRoomsFromDB }
    );
  });
});

module.exports = router;
