var createError = require('http-errors');
var path = require('path');
require('dotenv').config({path:'./config/.env'})
require('./helpers/handlebars');
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
app.engine( 'hbs',
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
app.use('/admin', express.static(path.join(__dirname, 'public')));
// app.use('/admin/alluser', express.static(path.join(__dirname, 'public')));
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
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
module.exports = app;
