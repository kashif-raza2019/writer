const mongoose = require('mongoose');

const DB_URI = "";

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
module.exports = {
    connection
}