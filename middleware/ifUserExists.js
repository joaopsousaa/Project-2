const UserModel = require("../models/User.model");

module.exports = async (req, res, next) => {
  const user = await UserModel.findById(req.session.userId);


  req.user = user;
  next();
};
