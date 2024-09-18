import { Socket } from "socket.io-client";



export default function Chat({socket} : {socket: Socket|null}) {
    return (
        <div className="bg-green-400">
            Chat
        </div>
    )
}