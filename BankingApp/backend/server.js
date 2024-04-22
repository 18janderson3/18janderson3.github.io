const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({path: "./config.env"});
const port = process.env.PORT || 5000;
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(express.json());


const session = require('express-session');  // new
const MongoStore = require('connect-mongo'); // new
const uri = process.env.ATLAS_URI;
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI
    })
}));

app.use(require("./routes/users"));


//get driver connection
const dbo = require("./db/conn");
app.listen(port, () => {
    //perform database connextion when sever starts
    dbo.connectToServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Server is running on port: ${port}`)
});

