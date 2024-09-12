"use client"

import { useRecoilState, useSetRecoilState } from "recoil"
import BoardCard from "./_components/BoardCard"
import CreateBoard from "./_components/CreateBoard"
import { boardsAtom } from "@/store/board"
import { useEffect } from "react"
import { friendsAtom, useFriendsStore } from "@/store/friends"
import { toast } from "sonner"


export default function Boards() {
    const [boards, setBoards]= useRecoilState(boardsAtom)
    // const setFriends= useSetRecoilState(friendsAtom)
    const setFriends= useFriendsStore( state => state.setFriends )
    // console.log("Boards:", boards);

    useEffect( () => {
        async function getFriendsList () {
            const resp= await fetch(`/api/friends/list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        
            if (resp.status !== 200) {
                console.error("Failed to fetch friends")
                toast.error("Failed to fetch friends")
            }
            else {
                const data= await resp.json()
                await setFriends(data)
            }
        }

        
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
        getFriendsList()
    }, [])


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