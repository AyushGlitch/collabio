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

const boardsUsersMap= new Map<string, string[]>()



io.on("connection", (socket) => {
    const boardId= socket.handshake.query.boardId as string
    const userId= socket.handshake.query.userId as string

    console.log("BoardId: ", boardId, "UserId: ", userId)
    console.log("New connection: ", socket.id)


    socket.on("join-room", ({boardId, userId}) => {
        socket.join(boardId)
        if (!boardsUsersMap.has(boardId)) {
            boardsUsersMap.set(boardId, [userId])
        }
        else {
            boardsUsersMap.get(boardId)!.push(userId)
        }
        io.in(boardId).emit('user-joined', boardsUsersMap.get(boardId))
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
            // console.log("State: ", state)
            
            if (!boardsStateMap.has(boardId)) {
                boardsStateMap.set(boardId, [state.canvasState])
                boardsStateIndexMap.set(boardId, 0)
            }
            else {
                const index= boardsStateIndexMap.get(boardId)!
                const states= boardsStateMap.get(boardId)!
                if (index < states.length-1) {
                    states.splice(index+1, states.length-1)
                }
                states.push(state.canvasState)
                boardsStateIndexMap.set(boardId, index+1)
            }
            console.log("States: ", boardsStateMap)
            // console.log("Index: ", boardsStateIndexMap)
        } 
    } )

    socket.on("undo-initialized", () => {
        if (boardsStateMap.has(boardId) && boardsStateIndexMap.has(boardId) && boardsStateIndexMap.get(boardId)! > 0) {
            const index= boardsStateIndexMap.get(boardId)!
            boardsStateIndexMap.set(boardId, index-1)
            const state= boardsStateMap.get(boardId)![index-1]
            io.in(boardId).emit('undo-redo-state', state)
        }
        else {
            io.in(boardId).emit('undo-redo-state', null)
        }
    })

    socket.on("redo-initialized", () => {
        // console.log("StateIndex: ", boardsStateIndexMap)
        if (boardsStateMap.has(boardId) && boardsStateIndexMap.has(boardId) && boardsStateIndexMap.get(boardId)! < boardsStateMap.get(boardId)!.length-1) {
            const index= boardsStateIndexMap.get(boardId)!
            boardsStateIndexMap.set(boardId, index+1)
            const state= boardsStateMap.get(boardId)![index+1]
            // console.log("Redo state: ", state, "Redo index: ", index+1)
            io.in(boardId).emit('undo-redo-state', state)
        }
        else {
            io.in(boardId).emit('undo-redo-state', null)
        }
    })

    socket.on("erase-board", () => {
        io.in(boardId).emit('erase-board-client')
    })

    socket.on("chat-message", (message) => {
        socket.broadcast.to(boardId).emit("chat-message", message)
    })

    socket.on("note-modified", (note) => {
        socket.broadcast.to(boardId).emit("note-modified", note)
    })

    socket.on("disconnect", () => {
        socket.leave(boardId)
        if (boardsUsersMap.get(boardId) && boardsUsersMap.get(boardId)!.length > 0) {
            boardsUsersMap.get(boardId)!.splice(boardsUsersMap.get(boardId)!.indexOf(userId), 1)
        }
        if (boardsUsersMap.get(boardId) && boardsUsersMap.get(boardId)!.length === 0) {
            boardsUsersMap.delete(boardId)
            boardsStateMap.delete(boardId)
            boardsStateIndexMap.delete(boardId)
        }
        io.in(boardId).emit('user-joined', boardsUsersMap.get(boardId))
        console.log("User disconnected: ", socket.id)
    })
})



server.listen(8000, () => {
    console.log("Server running on port 8000")
})