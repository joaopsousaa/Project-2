const router = require("express").Router();
const UserModel = require("../models/User.model");
const { isValidObjectId } = require("mongoose");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/:userId", isLoggedIn, (req, res) => {
  const isValidId = isValidObjectId(req.params.userId);
  const loggedInUserId = req.session.user._id;

  if (loggedInUserId !== req.params.userId) {
    return res.status(403).redirect("/");
  }

  if (!isValidId) {
    return res.redirect("/");
  }

  UserModel.findById(req.params.userId)
    .then((possibleUser) => {
      if (!possibleUser) {
        return res.redirect("/");
      }

      console.log("possibleUser:", possibleUser.email);
      res.render("user/user-profile", {
        user: possibleUser,
        userId: req.params.userId,
      });
    })
    .catch((err) => {
      console.log("err:", err);
      res.status(500).redirect("/");
    });
});

module.exports = router;
