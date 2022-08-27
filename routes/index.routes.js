const router = require("express").Router();
const GameRoomModel = require("../models/GameRoom.model");

// -------------------------- Routes ------------------------ //

/* GET home page */
router.get("/", (req, res) => {
  const { userId } = req.session;
  GameRoomModel.find({ status: { $ne: "finished" } }).then(
    (allGameRoomsFromDB) => {
      // allGameRoomsFromDB.forEach((gameRoom) => {
      //   console.log(gameRoom.status);
      // });

      // console.log(allGameRoomsFromDB);

      allGameRoomsFromDB.sort((a, b) => {
        return b.maxPlayers - a.maxPlayers;
      });

      // allGameRoomsFromDB.slice(0, 1);
      // [allGameRoomsFromDB] = allGameRoomsFromDB[0];
      console.log(typeof allGameRoomsFromDB);

      res.render("index", {
        userId: userId,
        gameRooms: allGameRoomsFromDB,
      });
    }
  );
});

module.exports = router;
