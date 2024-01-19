const isAuth = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect("/users/login");
    }
};
module.exports = isAuth;
