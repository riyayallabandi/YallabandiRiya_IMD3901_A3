const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const LISTER_PORT = 8080;
const ABS_STATIC_PATH = __dirname + '/public';

var users = 0;
io.on('connection', (socket) => {

  if (users%2 == 0) {
    socket.emit("player1");
  }
  else if (users%2 == 1) {
    socket.emit("player2");
  }
  users++;
  socket.on('getState', function () {
    socket.broadcast.emit('getState');
  });

  socket.on('state', function (value) {
    io.sockets.emit('state', value);
  });

  socket.on('changeColor', function (value) {
    io.sockets.emit('changeColor', value);
  });

  socket.on('board', function (value) {
    console.log(value);
    io.sockets.emit('board', { board: value.board, counter: value.counter + 1 });
  });

  socket.on('win',function(value){
    io.sockets.emit('win',value);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    io.sockets.emit('board', { board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], counter: 0 });
    io.sockets.emit('changeColor', "rgb(0,0,0)");
  });
});

// Set Route
app.get("/", function (req, res) {
  res.sendFile("index.html", { root: ABS_STATIC_PATH });
});

server.listen(LISTER_PORT);
app.use(express.static(__dirname + "/public"));
console.log("Listening on Port " + LISTER_PORT);