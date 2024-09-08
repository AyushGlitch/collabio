"use client"

import { Board } from "@/types/Board"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import BoardCard from "./_components/BoardCard"
import CreateBoard from "./_components/CreateBoard"


export default function Boards() {
    const [boards, setBoards]= useState<Board[]>([])

    useEffect( () => {
        async function getBoardsList() {
            const resp= await fetch(`/api/boards/list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (resp.status !== 200) {
                console.error("Failed to fetch boards")
                toast.error("Failed to fetch boards")
            }
            else {
                const data= await resp.json()
                setBoards(data)
            }
        }

        getBoardsList()
    }, [] )





    return (
        <div className="flex overflow-y-auto max-h-[69vh]">
            <div className="bg-slate-700 p-2 aspect-square h-80 rounded-3xl group flex justify-center">
                <CreateBoard />
            </div>

            {
                boards.length > 0 && boards.map( (board) => (
                    <BoardCard key={board.boardId} board={board} />
                ) )
            }
        </div>
    )
}