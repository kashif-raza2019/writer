const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    // uname: String,
    password: String,
    firstName: {type: String, default: ''},
    lastName : {type: String, default: ''},
    followers: {type: Array, default: []},
    following: {type: Array, default: []},
    bio: {type: String, default: 'Hey there, I am using Writer'},
    authenticated: {type: Boolean, default: false},
    authenticationToken: String,
    gender: {type: String, default: 'Unknown'},
    profilePicture: {type: String, default: 'unisex.png'},
    date: { type: Date, default: Date.now },   
});

// Creating Model from Schema and Exporting
module.exports = mongoose.model('User', UserSchema);