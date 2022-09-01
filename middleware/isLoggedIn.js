// ------------------- Middleware ------------------- //

// If there is no userId in the session, redirect to the login page.
module.exports = (req, res, next) => {
  const { userId } = req.session;

  if (!userId) return res.redirect("/auth/login");

  next();
};
