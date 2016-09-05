'use strict'

const net = require('net');
const mongoose = require('mongoose');
let sockets = []
let User = mongoose.model('User');
let Msg = mongoose.model('Msg');
const server = net.createServer((socket) => {
  // 'connection' listener
  sockets.push(socket)
  console.log('New person in the chat room!' + socket.name);

  socket.write('Welcome to the chat room');

  socket.on('data', function(data){
    sockets.forEach(function(s){
      if (s == socket) return;
      s.write(data);
    })
  });
  socket.on('end', (deadsocket) => {
    console.log('person left the room');
    let index = sockets.indexOf(deadsocket);
    sockets.splice(index, 1);
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('Chat room is now open!!');
});
