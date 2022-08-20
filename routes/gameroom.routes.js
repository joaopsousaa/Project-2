const router = require("express").Router();
const fs = require("fs");
const GameRoom = require("../models/GameRoom.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

router.get("/create", isLoggedIn, (req, res) => {
  const user = req.session.user;

  GameRoom.find({ players: user._id }).then((gamerooms) => {
    console.log(gamerooms);
    if (gamerooms.length > 0) {
      return res.redirect("/");
    }
  });

  const applistJson = fs.readFileSync("./applist.json");

  const games = JSON.parse(applistJson).applist.apps;

  res.render("gameroom/create", { games });
});

router.post("/create", isLoggedIn, (req, res) => {
  const { game } = req.body;
  let { name, minPlayers = 2, maxPlayers = 2 } = req.body;

  const user = req.user;

  if (!name) {
    name = `${user.username}'s Game Room`;
  }

  if (!game) {
    return res.status(400).render("gameroom/create", {
      errorMessage: "Please choose a game.",
    });
  }

  if (minPlayers < 2) {
    minPlayers = 2;
  }

  if (maxPlayers < 2) {
    maxPlayers = 2;
  }

  if (maxPlayers < minPlayers) {
    return res.status(400).render("gameroom/create", {
      errorMessage: "Your Max Players can't be smaller than your Min Players",
    });
  }

  GameRoom.create({
    name,
    game,
    owner: user,
    players: user,
    minPlayers,
    maxPlayers,
  }).then((gameroom) => {
    console.log(gameroom);
    return res.status(200).redirect(`/gameroom/${gameroom._id}`);
  });
});

router.get("/:gameRoomId", isLoggedIn, (req, res) => {
  const isValidId = isValidObjectId(req.params.gameRoomId);
  const user = req.session.user;

  if (!isValidId) return res.status(400).redirect("/");

  GameRoom.find({
    _id: { $ne: req.params.gameRoomId },
    players: user._id,
  })
    .then((gamerooms) => {
      console.log("Aqui");
      console.log(gamerooms);
      if (gamerooms.length > 0) return res.status(400).redirect("/");

      GameRoom.findById(req.params.gameRoomId).then((gameroom) => {
        if (!gameroom) return res.status(400).redirect("/");
        if (gameroom.owner._id === user._id)
          return res.render("gameroom/enter", { gameroom });
        if (gameroom.players.length >= gameroom.maxPlayers)
          return res.status(400).redirect("/");
        if (gameroom.players.includes(user._id))
          return res.render("gameroom/enter", { gameroom });

        GameRoom.findByIdAndUpdate(req.params.gameRoomId, {
          $push: { players: user._id },
        }).then((gameroom) => {
          console.log("Ali");
          if (!gameroom) return res.status(400).redirect("/");
          res.render("gameroom/enter", { gameroom });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).redirect("/");
    });
});

router.get("/:gameRoomId/leave", isLoggedIn, (req, res) => {
  const isValidId = isValidObjectId(req.params.gameRoomId);
  const user = req.session.user;

  if (!isValidId) return res.status(400).redirect("/");

  GameRoom.findById(req.params.gameRoomId)
    .then((gameroom) => {
      if (!gameroom) return res.status(400).redirect("/");

      console.log(gameroom.owner._id);
      console.log(user._id);

      if (gameroom.owner.equals(ObjectId(user._id))) {
        console.log("Aqui Remove");
        GameRoom.findByIdAndDelete(req.params.gameRoomId).then((gameroom) => {
          if (!gameroom) return res.status(400).redirect("/");
        });
      }

      GameRoom.findByIdAndUpdate(req.params.gameRoomId, {
        $pull: { players: user._id },
      }).then((gameroom) => {
        if (!gameroom) return res.status(400).redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).redirect("/");
    });
});

module.exports = router;
