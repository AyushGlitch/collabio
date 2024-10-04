import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import http from 'http';
// @ts-ignore
import { prisma } from './prisma/prismaClient';


dotenv.config();

class SocketServer {
    private static instance: SocketServer;
    private io: Server;
    private boardsStateMap: Map<string, string[]> = new Map();
    private boardsStateIndexMap: Map<string, number> = new Map();
    private roomUserCount: Map<string, number> = new Map();

    private constructor() {
        const app = express();
        const port= process.env.PORT || 10000
        app.use(cors());

        app.get('/', (req, res) => {
            res.send("Server is running");
            console.log("First request");
        });

        const server = http.createServer(app);
        this.io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL,
            }
        });

        this.initializeSocketEvents();

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }

    public static getInstance(): SocketServer {
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer();
        }
        return SocketServer.instance;
    }

    private initializeSocketEvents(): void {
        this.io.on("connection", (socket: Socket) => {
            const boardId = socket.handshake.query.boardId as string;
            const userId = socket.handshake.query.userId as string;

            console.log("BoardId: ", boardId, "UserId: ", userId, "SocketId: ", socket.id);

            socket.on("join-room", ({ boardId, userId }) => {
                socket.join(boardId);
                this.incrementRoomUserCount(boardId);
                console.log(`User ${userId} joined room ${boardId}`);
            });

            socket.on('object-data-to-server', (data) => {
                // console.log("Object data received: ", data);
                // console.log("Boards state map: ", this.boardsStateMap);
                // console.log("Boards state index map: ", this.boardsStateIndexMap);
                socket.broadcast.to(boardId).emit('object-data-from-server', data);
            });

            socket.on('get-initial-state', (callback) => {
                this.getInitialState(boardId, callback);
            });

            socket.on('save-state-on-server', (state) => {
                this.saveState(boardId, state);
            });

            socket.on("undo-initialized", () => {
                this.handleUndo(boardId);
            });

            socket.on("redo-initialized", () => {
                this.handleRedo(boardId);
            });

            socket.on("erase-board", () => {
                this.io.in(boardId).emit('erase-board-client');
            });

            socket.on("chat-message", (message) => {
                socket.broadcast.to(boardId).emit("chat-message", message);
            });

            socket.on("new-note-created", (note) => {
                socket.broadcast.to(boardId).emit("add-new-note", note);
            });

            socket.on("note-modified", (note) => {
                socket.broadcast.to(boardId).emit("note-modified", note);
            });

            socket.on("note-deleted", (noteId) => {
                socket.broadcast.to(boardId).emit("remove-deleted-node", noteId);
            });

            socket.on("disconnect", () => {
                this.handleDisconnect(socket, boardId);
            });
        });
    }

    private incrementRoomUserCount(boardId: string): void {
        const currentCount = this.roomUserCount.get(boardId) || 0;
        this.roomUserCount.set(boardId, currentCount + 1);
    }

    private decrementRoomUserCount(boardId: string): void {
        const currentCount = this.roomUserCount.get(boardId) || 0;
        if (currentCount > 0) {
            this.roomUserCount.set(boardId, currentCount - 1);
            if (currentCount - 1 === 0) {
                this.clearBoardState(boardId);
            }
        }
    }

    private clearBoardState(boardId: string): void {
        this.boardsStateMap.delete(boardId);
        this.boardsStateIndexMap.delete(boardId);
        console.log(`Cleared state for empty room ${boardId}`);
    }

    private handleDisconnect(socket: Socket, boardId: string): void {
        socket.leave(boardId);
        this.decrementRoomUserCount(boardId);
        console.log("User disconnected: ", socket.id);
    }

    private async getInitialState(boardId: string, callback: (state: string | null) => void): Promise<void> {
        if (this.boardsStateMap.has(boardId)) {
            const initialState = this.boardsStateMap.get(boardId)![this.boardsStateIndexMap.get(boardId)!];
            // console.log("Initial state from memory: ", initialState);
            callback(initialState);
        } else {
            const initialState = await this.getInitialStateFromDB(boardId);
            if (Object.keys(initialState!).length !== 0) {
                this.boardsStateMap.set(boardId, [initialState!]);
                this.boardsStateIndexMap.set(boardId, 0);
                // console.log("Initial state from DB: ", initialState);
                callback(initialState);
            } else {
                callback(null);
            }
        }
    }

    private async getInitialStateFromDB(boardId: string): Promise<string | null> {
        const boardJSON = await prisma.boards.findUnique({
            where: { boardId: boardId },
            select: { boardJSON: true }
        });

        // @ts-ignore
        return boardJSON?.boardJSON ?? null;
    }

    private saveState(boardId: string, state: { action: string; canvasState: string }): void {
        if (state.action === 'add' || state.action === 'modified') {
            if (!this.boardsStateMap.has(boardId)) {
                this.boardsStateMap.set(boardId, [state.canvasState]);
                this.boardsStateIndexMap.set(boardId, 0);
            } else {
                const index = this.boardsStateIndexMap.get(boardId)!;
                const states = this.boardsStateMap.get(boardId)!;
                if (index < states.length - 1) {
                    states.splice(index + 1, states.length - 1);
                }
                states.push(state.canvasState);
                this.boardsStateIndexMap.set(boardId, index + 1);
            }
        }
    }

    private handleUndo(boardId: string): void {
        if (this.boardsStateMap.has(boardId) && this.boardsStateIndexMap.has(boardId) && this.boardsStateIndexMap.get(boardId)! > 0) {
            const index = this.boardsStateIndexMap.get(boardId)!;
            this.boardsStateIndexMap.set(boardId, index - 1);
            const state = this.boardsStateMap.get(boardId)![index - 1];
            this.io.in(boardId).emit('undo-redo-state', state);
        } else {
            this.io.in(boardId).emit('undo-redo-state', null);
        }
    }

    private handleRedo(boardId: string): void {
        if (this.boardsStateMap.has(boardId) && this.boardsStateIndexMap.has(boardId) && this.boardsStateIndexMap.get(boardId)! < this.boardsStateMap.get(boardId)!.length - 1) {
            const index = this.boardsStateIndexMap.get(boardId)!;
            this.boardsStateIndexMap.set(boardId, index + 1);
            const state = this.boardsStateMap.get(boardId)![index + 1];
            this.io.in(boardId).emit('undo-redo-state', state);
        } else {
            this.io.in(boardId).emit('undo-redo-state', null);
        }
    }
}

// Usage
const socketServer = SocketServer.getInstance();

export default SocketServer;