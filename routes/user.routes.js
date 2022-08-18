const router = require("express").Router();
const UserModel = require("../models/User.model");
const { isValidObjectId } = require("mongoose");

router.get("/:userId", (req, res) => {
  const isValidId = isValidObjectId(req.params.userId);

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
