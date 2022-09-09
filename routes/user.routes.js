const router = require("express").Router();
const UserModel = require("../models/User.model");
const GameRoomModel = require("../models/GameRoom.model");

const { isValidObjectId } = require("mongoose");
const { getSuggestedGameRooms, getUserFriendList } = require("../utils");

// -------------------------- Routes ------------------------ //

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const sessionUserId = req.session.userId;
  const isValidId = isValidObjectId(userId);

  if (!isValidId) return res.status(400).redirect("/");

  UserModel.findById(userId)
    .then(async (user) => {
      if (!user) return res.status(400).redirect("/");

      const { friendsList, requestsList } = await getUserFriendList(user);

      GameRoomModel.find({ players: user._id, status: "finished" }).then(
        (gameRoomsFinished) => {
          getSuggestedGameRooms(user).then((suggestedGameRooms) => {
            GameRoomModel.find({
              players: user._id,
              status: { $ne: "finished" },
            }).then((gameRoomsPlaying) => {
              return res.render("user/profile", {
                userId: sessionUserId,
                user,
                gameRoomsFinished,
                gameRoomsPlaying,
                suggestedGameRooms,
                friendsList,
                requestsList,
              });
            });
          });
        }
      );
    })
    .catch((err) => {
      console.log("err:", err);
      res.status(500).redirect("/");
    });
});

module.exports = router;
