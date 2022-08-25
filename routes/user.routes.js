const router = require("express").Router();
const UserModel = require("../models/User.model");
const GameRoomModel = require("../models/GameRoom.model");

const { isValidObjectId } = require("mongoose");
const { getOwnedGames } = require("../utils");

// -------------------------- Routes ------------------------ //

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const isValidId = isValidObjectId(userId);

  if (isValidId) {
    UserModel.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(400).redirect("/");
        }

        GameRoomModel.find({ players: user._id, status: "finished" }).then(
          (gameRooms) => {
            getOwnedGames(user.steamId).then((games) => {
              return res.render("user/profile", { user, gameRooms, games });
            });
          }
        );
      })
      .catch((err) => {
        console.log("err:", err);
        res.status(500).redirect("/");
      });
  } else {
    UserModel.findOne({ username: userId })
      .then((user) => {
        if (!user) {
          return res.status(400).redirect("/");
        }

        GameRoomModel.find({ players: user._id, status: "finished" }).then(
          (gameRooms) => {
            getOwnedGames(user.steamId).then((games) => {
              return res.render("user/profile", { user, gameRooms, games });
            });
          }
        );
      })
      .catch((err) => {
        console.log("err:", err);
        res.status(500).redirect("/");
      });
  }
});

module.exports = router;
