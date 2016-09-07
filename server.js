'use strict'

const net = require('net');
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var Promise = require('es6-promise').Promise;
let sockets = []

var app = express();
app.use(express.static(__dirname + "/app"));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

var userSchema = mongoose.Schema({
  name: String
});
var msgSchema = mongoose.Schema({
  msg: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'StellaUser',
    required: true
  }
},
{ timestamps: true });
var User = mongoose.model('StellaUser', userSchema);
var Message = mongoose.model('StellaMessage', msgSchema);


db.once('open', function () {
  console.log('DB open!');



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

  function getUsersById(name, callback) {
    User.findOne({name: name}, function(err, obj) {
      if(err) { return callback(err, null); }
      if (obj == null){
        var newuser = new User({ name: name });
        newuser.save(function (err, user) {
          if (err) return callback(err, null);
          return callback(null, newuser);
        });
      }
      else {
        return callback(null, obj)
      }
    });
  }

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/app/index.html');
  });

  app.get('/messages', function(req, res){
    Message.find({}, {}, { sort: { 'createdAt' : -1 } }, function (err, messages) {
      if (err) return console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(messages));
    }).limit(6);
  })

  app.post('/messages', function(req, res){

    getUsersById(req.body.data.user, function(err, user){
      if (err == null){
        var newMessage = Message({
          msg: req.body.data.content,
          user: user.id
        });
        newMessage.save(function (err, fluffy) {
          if (err) return console.error(err);
          res.send({'status':'success'});
        });
      }
    });
  });
});
