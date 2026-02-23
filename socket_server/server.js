const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET" , "POST"]
    },
});

global.io = io;


io.on("connection" , (socket)=>{
    console.log("user connected: ",socket.id);
    const clerk_id = socket.handshake.auth.clerk_id;

    if(!clerk_id){socket.disconnect(); return ;}


    socket.on("join_poll" , (pollid)=>{
        socket.join(pollid);
        console.log(`${clerk_id} joined poll: ${pollid}`);
    })

    socket.on("disconnect" , ()=>{
        console.log("user disconnected: ",socket.id);
    })

})

app.use("/notify-update" , (req , res)=>{

    console.log("notify update hit");
    const{pollid , data} = req.body;
    console.log(pollid , data);
    io.to(pollid).emit("update_poll" , data);

    res.send({success: true}).status(200);
})

server.listen(4000 , ()=>{
    console.log("socket server running on port 4000");
})