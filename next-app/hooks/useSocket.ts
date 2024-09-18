"use client"

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { redirect } from "next/navigation";


export default function useSocket({boardId}: {boardId: string}) {
    const [socket, setSocket]= useState<Socket | null>(null);
    const user= useUserStore( (state) => state.getUser() )

    // if (user.id === "" || user.id === undefined) {
    //     redirect('/auth/signin')
    // }

    useEffect( () => {
        const socket= io("http://localhost:8000", {
            query: {
                boardId: boardId,
                userId: user.id,
            }
        })
        socket.on("connect", () => {
            setSocket(socket)
            socket.emit("join-room", {boardId: boardId, userId: user.id})
            console.log("Connected to server with Socket ID: ", socket.id)
        })

        socket.on("disconnect", () => {
            setSocket(null)
            console.log("Disconnected from server with Socket ID: ", socket.id)
        })

        return () => {
            socket.disconnect()
        }

    }, [boardId] )

    return socket
}