// Models
const UserModel = require("../models/User.model");

// ------------------- Middleware ------------------- //
module.exports = async (req, res, next) => {
  const { userId } = req.session;
  const user = await UserModel.findById(userId);

  if (!user) return res.redirect("/");

  req.user = user;
  next();
};
