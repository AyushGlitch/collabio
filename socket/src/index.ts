import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';


const app= express()
app.use(cors())
const server= http.createServer(app)
const io= new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})


io.on("connection", (socket) => {
    const {boardId, userId}= socket.handshake.query
    console.log("New connection: ", socket.id)

    socket.on("join-room", ({boardId, userId}) => {
        socket.join(boardId)
        console.log(`User ${userId} joined room ${boardId}`)
    })

    socket.on('object-data-to-server', (data) => {
        // Broadcast the object data to all other clients
        console.log("Received object data: ", data)
        socket.broadcast.to(boardId!).emit('object-data-from-server', data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id)
    })
})



server.listen(8000, () => {
    console.log("Server running on port 8000")
})