"use client"

import { useRecoilState } from "recoil"
import BoardCard from "./_components/BoardCard"
import CreateBoard from "./_components/CreateBoard"
import { boardsAtom } from "@/store/board"


export default function Boards() {
    const [boards, setBoards]= useRecoilState(boardsAtom)
    console.log("Boards:", boards);

    return (
        <div className="bg-slate-600 p-2 grid grid-cols-3 overflow-y-auto h-full gap-4 max-h-[71vh] no-scrollbar rounded-3xl">
            <div className="bg-slate-700 p-2 aspect-square h-100 rounded-3xl group flex justify-center">
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