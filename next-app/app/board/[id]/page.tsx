"use client"

import Notes from "./_components/Notes"
import Whiteboard from "./_components/Whiteboard"
import Chat from "./_components/Chat"
import useSocket from "@/hooks/useSocket"
import Loader from "@/components/Loader"
import Toolbar from "./_components/Toolbar"


export default function Page({params} : {params: {id: string}}) {
    const socket= useSocket({boardId: params.id})

    return (
        !socket ? (
            <div className="flex h-screen w-full justify-center items-center">
                <Loader size={200} />
            </div>
        ) :
        (<div className="grid grid-cols-5 pt-[7%] min-h-screen gap-1">
            <div className="col-span-4">
                <Whiteboard socket={socket} />
            </div>
            <div className="grid grid-rows-3">
                <div className="row-span-1">
                    <Notes socket={socket} />
                </div>
                <div className="row-span-2">
                    <Chat socket={socket} />
                </div>
            </div>
        </div>)
    )
}