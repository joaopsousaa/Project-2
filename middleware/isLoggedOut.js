// ------------------- Middleware ------------------- //

// If there is an userId in the session, redirect to the home page.
module.exports = (req, res, next) => {
  const { userId } = req.session;

  if (userId) return res.redirect("/");

  next();
};
