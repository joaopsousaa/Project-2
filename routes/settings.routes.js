const router = require("express").Router();
const UserModel = require("../models/User.model");
const { resolveVanityURL } = require("../utils");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const ifUserExists = require("../middleware/ifUserExists");

// ---------------------- Router Configs ---------------------- //
router.use(isLoggedIn);
router.use(ifUserExists);

// -------------------------- Routes ------------------------ //

// GET /settings - Render the settings page
router.get("/", (req, res) => {
  const { user } = req; // req.user is set by the ifUserExists middleware
  res.render("settings/settings", { userId: user._id, user });
});

// POST /settings - Update the user's settings
router.post("/", async (req, res) => {
  const { user } = req;

  const { username, email, password, confirmPassword, steamVanityUrl } =
    req.body;

  if (password !== confirmPassword) {
    return res.render("settings/settings", {
      errorMessage: "Passwords don't match",
      user,
    });
  }

  const oneUser = await UserModel.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: user._id },
  });

  if (oneUser) {
    return res.render("settings/settings", {
      errorMessage: "Username or email already taken",
      user,
    });
  }

  let steamId = null;

  if (steamVanityUrl) {
    steamId = await resolveVanityURL(steamVanityUrl);

    if (!steamId) {
      if (steamVanityUrl.match(/^[0-9]+$/)) {
        steamId = steamVanityUrl;
      } else {
        return res.render("settings/settings", {
          errorMessage: "Invalid Steam vanity URL",
          user,
        });
      }
    }
  }

  if (password) {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return UserModel.findByIdAndUpdate(
          user._id,
          {
            username,
            email,
            password: hashedPassword,
            steamVanityUrl,
            steamId,
          },
          { new: true }
        )
          .then((user) => {
            if (!user) res.redirect("/");
            res.redirect("/settings");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/");
          });
      });
  } else {
    UserModel.findByIdAndUpdate(
      user._id,
      {
        username,
        email,
        steamVanityUrl,
        steamId,
      },
      { new: true }
    )
      .then((user) => {
        if (!user) res.redirect("/");
        res.redirect("/settings");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  }
});

// ----------------------------------------------------------- //
module.exports = router;
