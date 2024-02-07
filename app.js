var createError = require('http-errors');
var path = require('path');
require('dotenv').config({path:'./config/.env'})
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var connect=require('./config/mongoConnect')
var exphbs=require('express-handlebars');
const routerMiddleware = require('./middleware/routes');
const {error, errorHandling} = require("./middleware/error");
// const MongodbStore=require('connect-mongodb-session')(session)
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exphbs.engine({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:path.join(__dirname,'views/layouts'),
    partialsDir:path.join(__dirname,'views/partials')
  }),
 
)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/users', express.static(path.join(__dirname, 'public/admin')));
// app.use('/users', express.static(path.join(__dirname, 'public/users')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/admin/alluser', express.static(path.join(__dirname, 'public')));
app.use('/users', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:  process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge:600000 }
  // store:new MongodbStore({mongooseConnection:connect})
}))

app.use (routerMiddleware());
app.use(error)
app.use(errorHandling)
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Handle the error or log it as needed
});


module.exports = app;
