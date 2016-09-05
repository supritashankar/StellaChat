const net = require('net');
const server = net.createServer((socket) => {
  // 'connection' listener
  console.log('client connected');
  socket.on('end', () => {
    console.log('client disconnected');
  });
  socket.write('hello\r\n');

  socket.on('data', function(data){
    socket.write(data);
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
