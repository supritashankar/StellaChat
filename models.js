'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, default: '' }
});

let MsgSchema = new Schema({
  msg: {
    type: String,
    default: ''
  },
  user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});


mongoose.model(UserSchema);
mongoose.model(MsgSchema);
