const express = require('express')
const app=express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
var numClients={};
io.on('connection',(socket)=>{
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
        console.log(io.sockets.adapter.rooms.get(data).size);
        if (io.sockets.adapter.rooms.get(data).size===1) {
            io.to(socket.id).emit("symbol",1);
        } else {
            io.to(socket.id).emit("symbol",2);
        }
    })

    socket.on("new_move",(data)=>{
        console.log(data);
        socket.to(data.roomId).emit("update",data);
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });

})

server.listen(5000, () => {
    console.log("SERVER RUNNING");
  });