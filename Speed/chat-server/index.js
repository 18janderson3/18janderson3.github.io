const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config({path: "./config.env"});
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);

//dotenv.config();
const port = process.env.PORT || 5000;



// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log('MongoDB connection established successfully');
// });

// Middleware
app.use(cors());
app.use(express.json());


app.use(require("./routes/scores"));

//get driver connection
const dbo = require("./db/conn");
server.listen(port, () => {
    //perform database connextion when sever starts
    dbo.connectToServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Server is running on port: ${port}`)
});

// API Routes
// const messagesRouter = require('./routes/messages');
// app.use('/messages', messagesRouter);
app.get('/', (req, res) => {
  res.send('hello world')
})




// Start server
//server.listen(port, () => {
//  console.log(`Server running on port ${port}`);
//});

//let started = false;
// Socket.IO
io.on('connection', (socket) => {
  
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendCardState', (message) => {
    console.log("sending cardstate signal");
    io.emit('cardstate', message);
  });
  socket.on('sendPickup', (message) => {
    console.log("sending pickup signal");
    io.emit('pickup', message);
  });

  socket.on('sendStart', (message) => {
    //if(!started){
      console.log("starting game");
      io.emit('start', message);
      //started = true;
    //} else {
      //console.log("game already started");
    //}
  });
  // socket.on('differentMessage', (message) => {
  //   io.emit('diffentResponse', "I like you");
  // });
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});