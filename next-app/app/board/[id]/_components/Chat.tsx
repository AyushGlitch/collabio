"use client"

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMessagesStore } from "@/store/messages";
import { useUserStore } from "@/store/user";
import Message from "@/types/Message";
import { Delete, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";



export default function Chat({socket, boardId} : {socket: Socket|null, boardId: string}) {
    const [message, setMessage]= useState<string>("")
    const user= useUserStore( state => state.getUser() )
    const [messages, addMessage, getMessages, getAllMessages]= useMessagesStore( state => [state.messages, state.addMessage, state.getMessages, state.getAllMessages] )
    const chatContainerRef = useRef<HTMLDivElement>(null);


    useEffect( () => {
        if (!socket) {
            return
        }

        socket.on("chat-message", (message) => {
            console.log("Message Received: ", message)
            // console.log("Messages: ", getAllMessages())
            addMessage(message.boardId, message.message)
        })

        return () => {
            socket.off("chat-message")
        }
    }, [socket, boardId] )

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages[boardId]]);


    function handleSendMessage() {
        if (message.trim() === "" || !socket) {
            return
        }

        const newMsg: Message= {
            msgId: new Date().toISOString(),
            userId: user.id,
            username: user.name,
            message: message,
        }

        addMessage(boardId, newMsg)
        socket.emit("chat-message", {boardId, message: newMsg})
        // console.log("Messages: ", getAllMessages())

        setMessage("")
        const messageElement = document.getElementById("message-box") as HTMLTextAreaElement
        messageElement.value= ""
    }


    return (
        <div className="flex flex-col gap-2 h-full p-1">
            <div ref={chatContainerRef} className="flex flex-col gap-1 p-2 overflow-y-auto h-5/6 w-full bg-slate-800 no-scrollbar rounded-xl">
                {
                    !messages[boardId] ? (
                        <div className="flex h-full w-full justify-center items-center text-3xl font-bold">
                            No Chat Messages...!!!
                        </div>
                    ) : (
                        messages[boardId].map( (msg) => (
                            msg.userId === user.id ? (
                                <div key={msg.msgId} className="flex flex-col w-2/3 items-start self-end bg-emerald-700 rounded-xl p-1 pl-3">
                                    <div className="text-sm font-bold">
                                        You
                                    </div>
                                    <div className="text-xs font-medium break-words w-full whitespace-pre-wrap">
                                        {msg.message}
                                    </div>
                                </div>
                            ) : (
                                <div key={msg.msgId} className="flex flex-col w-2/3 items-start bg-slate-700 rounded-xl p-1 pl-3">
                                    <div className="text-sm font-bold">
                                        {msg.username.length > 7 ? msg.username.slice(0, 7) + "..." : msg.username}
                                    </div>
                                    <div className="text-xs font-medium break-words w-full whitespace-pre-wrap">
                                        {msg.message}
                                    </div>
                                </div>
                            )
                        ) )
                    )
                }
            </div>
            
            <div className="flex gap-1 justify-around items-center">
                <Textarea placeholder="Type a message" className="p-1 w-10/12" id="message-box" onChange={(e) => setMessage(e.target.value)} />
                <Button variant={"ghost"} size={"icon"}  >
                    <Send className="cursor-pointer text-blue-400 " size={35} onClick={() => handleSendMessage()} />
                </Button>
            </div>
        </div>
    )
}