const router = require("express").Router();
const UserModel = require("../models/User.model");
const { resolveVanityURL } = require("../utils");

// Middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const ifUserExists = require("../middleware/ifUserExists");

// ---------------------- Router Configs ---------------------- //
router.use(isLoggedIn);
router.use(ifUserExists);

// -------------------------- Routes ------------------------ //

// GET /settings - Render the settings page
router.get("/", isLoggedIn, (req, res) => {
  const { user } = req.session;
  res.render("settings/settings", { user });
});

// POST /settings - Update the user's settings
router.post("/", isLoggedIn, async (req, res) => {
  const { user } = req.session;

  const { username, email, password, confirmPassword, steamVanityUrl } =
    req.body;

  if (password !== confirmPassword) {
    return res.render("settings/settings", {
      errorMessage: "Passwords don't match",
      user,
    });
  }

  const oneUser = await User.findOne({
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

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      username,
      email,
      //   password: bcryptjs.hashSync(password, salt),
      steamVanityUrl,
      steamId,
    },
    { new: true }
  );

  // req.session.user = updatedUser._id;

  res.redirect("/settings");
});

// ----------------------------------------------------------- //
module.exports = router;
