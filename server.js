const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: 'https://vanilla-racing-dev.glitch.me',
    methods: ['GET'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const players = {};

io.on('connection', (socket) => {
  console.log('Player connected ' + socket.id);
  
  socket.on('update', (msg) => {
    socket.broadcast.emit('update', msg);
  });
  
  socket.on('newPlayer', (msg) => {
    console.log('New player ' + socket.id);
    msg.id = socket.id;
    socket.broadcast.emit('newPlayer', msg);
    players[socket.id] = msg;
    socket.emit('players', players);
  });
  
  socket.on('disconnect', () => {
    console.log('Player disconnected' + socket.id);
    socket.broadcast.emit('playerExit', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Listening on 3000');
});