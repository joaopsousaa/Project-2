const router = require("express").Router();
const fs = require("fs");
const GameRoom = require("../models/GameRoom.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { isValidObjectId } = require("mongoose");

router.get("/create", isLoggedIn, (req, res) => {
  const applistJson = fs.readFileSync("./applist.json");

  const games = JSON.parse(applistJson).applist.apps;

  res.render("gameroom/create", { games });
});

router.post("/create", isLoggedIn, (req, res) => {
  const { name, game, minPlayers = 2, maxPlayers } = req.body;

  const user = req.user;

  if (!name) {
    return (name = `${user.username}'s Game Room`);
  }

  if (!game) {
    return res.status(400).render("gameroom/create", {
      errorMessage: "Please choose a game.",
    });
  }

  if (!minPlayers) {
    return (minPlayers = 2);
  }

  if (!maxPlayers) {
    return (maxPlayers = 20);
  }

  if (maxPlayers < minPlayers) {
    return res.status(400).render("gameroom/create", {
      errorMessage: "Your Max Players can't be smaller than your Min Players",
    });
  }

  GameRoom.findOne({ name }).then((found) => {
    if (found) {
      return res.status(400).render("gameroom/create", {
        errorMessage: "GameRoom Name already taken.",
      });
    }

    GameRoom.create({
      name,
      game,
      owner: user,
      players: [],
      minPlayers,
      maxPlayers,
    });

    return res.redirect("/");
  });
});

router.get("/:gameRoomId", isLoggedIn, (req, res) => {
  const isValidId = isValidObjectId(req.params.gameRoomId);

  GameRoom.findById(req.params.gameRoomId)
    .then((possibleGameRoom) => {
      if (!possibleGameRoom) {
        return res.redirect("/");
      }
      res.render("gameroom/enter");
    })
    .catch((err) => {
      res.status(500).redirect("/");
    });
});

module.exports = router;
