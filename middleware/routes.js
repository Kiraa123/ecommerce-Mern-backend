var express = require('express');

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var adminRouter = require('../routes/admin')

const routerMiddleware = () => {
    const router = express.Router();

    router.use('/', indexRouter);
    router.use('/users', usersRouter);
    router.use('/admin', adminRouter);

    return router;


};
module.exports = routerMiddleware;