"use client"

import { Board } from "@/types/Board";


export default function BoardCard ({board} : {board: Board}) {
    return (
        <div className="bg-slate-700 group p-2 aspect-square h-80 rounded-3xl flex flex-col gap-2">
            <p className="text-base font-medium"><span className="font-bold">BoardId: </span>{board.boardId}</p>
            <p className="text-xl font-bold">{board.boardTitle}</p>
        </div>
    )
}
