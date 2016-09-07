'use strict'

import net from 'net';
import express from "express";
import mongoose from 'mongoose';
let sockets = []

const app = express();
app.use(express.static(__dirname + "/app"));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test');
const db = mongoose.connection;

const userSchema = mongoose.Schema({
  name: String
});
const msgSchema = mongoose.Schema({
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
const User = mongoose.model('StellaUser', userSchema);
const Message = mongoose.model('StellaMessage', msgSchema);


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
  app.listen(8080, () => {
    console.log("App now running on port 8080");
  });

  let getUsersById = (name, callback) => {
    User.findOne({name: name}, function(err, obj) {
      if(err) { return callback(err, null); }
      if (obj == null){
        let newuser = new User({ name: name });
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

  app.get('/', (req, res) => {
    res.sendfile(__dirname + '/app/index.html');
  });

  app.get('/messages', (req, res) => {
    Message.find({}, {}, { sort: { 'createdAt' : -1 } }, function (err, messages) {
      if (err) return console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(messages));
    }).limit(6);
  })

  app.post('/messages', (req, res) => {
    getUsersById(req.body.user.name, function(err, user){
      if (err == null){
        let newMessage = Message({
          msg: req.body.data.content,
          user: user.id
        });
        newMessage.save(function (err, result) {
          if (err) res.send({'status':'error'});
          res.send({'status':'success'});
        });
      }
    });
  });
});
