#!/usr/bin/env node

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('maze-app2:server');
const http = require('http');
const u = require("./app.utils")

const solverRouter = require('./routes/solver');
const submitterRouter = require('./routes/submitter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/', submitterRouter);
app.use('/solve', solverRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // const error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  // res.send({error: err.message, stack: error.stack});
  res.send({error: err.message});
});

// Get port from environment and store in Express.
const port = u.normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Event listener for HTTP server "error" event.
const onError = error => {
  if (error.syscall !== 'listen') {
      throw error;
  }

  const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
      case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
      default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log("Server running on port " + port);