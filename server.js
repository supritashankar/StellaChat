'use strict'

const net = require('net');
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var User = require('./models').user;
var Message = require('./models').message;
var ObjectID = mongodb.ObjectID;
let sockets = []

var app = express();
app.use(express.static(__dirname + "/app"));
app.use(bodyParser.json());

process.env.MONGODB_URI = 'mongodb://localhost/stellachat';
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  var db = database;
  console.log("Database connection ready");
  const server = net.createServer((socket) => {
    // 'connection' listener
    socket.identity = socket.remoteAddress + ":" + socket.remotePort
    sockets.push(socket)
    console.log('New person in the chat room!' + socket.identity);

    socket.write('Welcome to the chat room');

    // socket.on('data', function(data){
    //   sockets.forEach(function(s){
    //     if (s == socket) return;
    //     //s.write(data);
    //   })
    // });
    // socket.on('end', (deadsocket) => {
    //   console.log('person left the room');
    //   let index = sockets.indexOf(deadsocket);
    //   sockets.splice(index, 1);
    // });

  });
  server.on('error', (err) => {
    throw err;
  });
  server.listen(8124, () => {
    console.log('Chat room is now open!!');
  });
  app.listen(8080, function () {
    console.log("App now running on port 8080");
  });

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/app/index.html');
  });

  app.get('/messages', function(req, res){
    var newUser = User({
      username: 'supshankar1',
    });
    console.log(newUser);
    newUser.save(function(err) {
      if (err) throw err;

      console.log('User created!');
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify([{ id: 1, content: "Hey!"},{ id: 2, content: "Hello!"} ]));
  })

  app.post('/messages', function(req, res){
    console.log('inside', req.body);
    var newMesage = Message({
      content: req.body.content,
    });
    newMesage.save(function(err) {
      if (err) throw err;
      console.log('party!');
      res.send(JSON.stringify({'message':'success'}));
    });
    res.send(JSON.stringify({'message':'success'}));
  });

});
