module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.userId) {
    console.log("You are not logged in");
    return res.redirect("/auth/login");
  }
  // console.log("You are logged in");
  // req.user = req.session.user;
  next();
};
