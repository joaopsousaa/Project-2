const router = require("express").Router();
const fs = require("fs");
const GameRoomModel = require("../models/GameRoom.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/create", isLoggedIn, (req, res) => {
  const applistJson = fs.readFileSync("./applist.json");

  const games = JSON.parse(applistJson).applist.apps;

  res.render("gameroom/create", { games });
});

router.post("/create", isLoggedIn, async (req, res) => {
  const { name, game, minPlayers = 2, maxPlayers } = req.body;

  const user = req.session.user;

  if (!name) {
    name = `${user.username}'s Game Room`;
  }

  //   const gameroom = GameRoom.create({
});

module.exports = router;
