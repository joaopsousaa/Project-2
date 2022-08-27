const router = require("express").Router();

// Models
const GameRoomModel = require("../models/GameRoom.model");

// ------------------- Routes ------------------- //

// POST /search --> Search for a game room
router.post("/", (req, res) => {
  const { search } = req.body;

  console.log(search);

  GameRoomModel.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { game: { $regex: search, $options: "i" } },
    ],
    status: "waiting",
  })
    .then((gameRooms) => {
      res.render("search", { gameRooms });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ---------------------------------------------- //
module.exports = router;
