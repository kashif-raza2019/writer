const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const MemoryStore = require('memorystore')(session);
const port = process.env.PORT;

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: "SECRET",
    saveUninitialized: false
}));


// Setting the view engine
app.set('view engine', 'ejs');
// Setting the views directory
app.set('views', path.join(__dirname, 'views'));

// Database connection
const mongoDB = require('./controller/db_connection');
const connection = mongoDB.connection;


// Setting the public directory and BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public' ,express.static(path.join(__dirname, 'public')));

// Routes
const homeRoute = require(path.join(__dirname, 'route', 'home.js'));
app.use(homeRoute);

app.listen(port, (req, res)=>{
    console.log(`Server Running on Port: `);
    connection.once('open', ()=>{
        console.log('Connected to MongoDB');
    });
});