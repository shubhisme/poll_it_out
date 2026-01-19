const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET" , "POST"]
    },
});

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})  

io.on("connection" , (socket)=>{
    console.log("user connected: ",socket.id);

    socket.on("join_poll" , (pollid)=>{
        socket.join(pollid);
        console.log(`User joined poll: ${pollid}`);
    })


})

server.listen(4000 , ()=>{
    console.log("socket server running on port 4000");
})