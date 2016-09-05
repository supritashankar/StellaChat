'use strict'

const net = require('net');
let sockets = []
const server = net.createServer((socket) => {
  // 'connection' listener
  sockets.push(socket)
  console.log('New person in the chat room!');

  socket.write('Welcome to the chat room\r\n');

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
  console.log('server bound');
});
