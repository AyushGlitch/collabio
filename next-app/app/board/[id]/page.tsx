"use client"

import Notes from "./_components/Notes"
import Whiteboard from "./_components/Whiteboard"
import Chat from "./_components/Chat"
import useSocket from "@/hooks/useSocket"
import Loader from "@/components/Loader"


export default function Page({params} : {params: {id: string}}) {
    const socket= useSocket({boardId: params.id})

    return (
        !socket ? (
            <div className="flex h-screen w-full justify-center items-center">
                <Loader size={200} />
            </div>
        ) :
        (<div className="grid grid-cols-11 pt-[7%] max-h-screen gap-1">
            <div className="col-span-8 max-h-screen">
                <Whiteboard socket={socket} boardId={params.id} />
            </div>
            <div className="grid col-span-3 grid-rows-2 max-h-screen">
                <div className="row-span-1">
                    <Notes socket={socket} />
                </div>
                <div className="row-span-1">
                    <Chat socket={socket} boardId={params.id} />
                </div>
            </div>
        </div>)
    )
}