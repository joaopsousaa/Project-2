const router = require("./auth.routes");

router.post("/search", (req, res) => {
  const { search } = req.body;

  if (!search) {
    return res.render("search/search", {
      errorMessage: "Please provide a search term.",
    });
  }

  GameRoomModel.find(search).then((gamerooms) => {
    res.render("search", { gameRooms });
  });
});
