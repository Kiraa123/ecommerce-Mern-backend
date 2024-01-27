const isAdmin = (req, res, next) => {
  const confirm=req.session.user
    if (req.session.loggedIn && confirm.role=='admin') {
      next();
    } else {
        res.redirect('/users/login');
    }
  };

  module.exports = isAdmin