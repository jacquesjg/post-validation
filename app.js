require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log('MONGODB CONNECTED');
  })
  .catch((e) => {
    console.log(e);
  });

var usersRouter = require('./routes/users/usersRouter');
var postRouter = require('./routes/posts/postRouter');
var commentRouter = require('./routes/comments/commentRouter');

var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: 'Error', error: err.message });
});

module.exports = app;
