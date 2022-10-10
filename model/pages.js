const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    userId: String,
    username: String,
    title: String,
    content: String,
    likes: {type: Array, default: []},
    // Post is Public or Private
    writeStatus: {type: String, default: 'private'},
    impressions :{type: Number, default: 0},
    readTime: {type: String, default: '1 min'},
    date: { type: Date, default: Date.now }
});

// Creating Model from Schema and Exporting
module.exports = mongoose.model('Pages', PageSchema);