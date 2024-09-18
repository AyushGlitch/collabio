import { Socket } from "socket.io-client";



export default function Notes ({socket} : {socket: Socket|null}) {
    return (
        <div className="bg-yellow-400">
            Notes
        </div>
    )
}