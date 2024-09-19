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


const boardsStateMap= new Map<string, string[]>()
const boardsStateIndexMap= new Map<string, number>()


io.on("connection", (socket) => {
    const boardId= socket.handshake.query.boardId as string
    const userId= socket.handshake.query.userId as string

    console.log("BoardId: ", boardId, "UserId: ", userId)
    console.log("New connection: ", socket.id)


    socket.on("join-room", ({boardId, userId}) => {
        socket.join(boardId)
        console.log(`User ${userId} joined room ${boardId}`)
    })


    socket.on('object-data-to-server', (data) => {
        // Broadcast the object data to all other clients
        // console.log("Received object data: ", data)
        socket.broadcast.to(boardId!).emit('object-data-from-server', data);
    });


    socket.on('get-initial-state', (callback) => {
        if (boardsStateMap.has(boardId)) {
            const intialState= boardsStateMap.get(boardId)![boardsStateIndexMap.get(boardId)!]
            // console.log("Initial state: ", intialState)
            callback(intialState)
        }
        else {
            callback(null)
        }
    } )


    socket.on('save-state-on-server', (state) =>  {
        if (state.action === 'add' || state.action === 'modified') {
            
            if (!boardsStateMap.has(boardId)) {
                boardsStateMap.set(boardId, [state.canvasState])
                boardsStateIndexMap.set(boardId, 0)
            }
            else {
                boardsStateMap.set(boardId, [...boardsStateMap.get(boardId)!, state.canvasState])
                boardsStateIndexMap.set(boardId, boardsStateMap.get(boardId)!.length-1)
            }
            // console.log("States: ", boardsStateMap)
            // console.log("Index: ", boardsStateIndexMap)
        } 
    } )

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id)
    })
})



server.listen(8000, () => {
    console.log("Server running on port 8000")
})