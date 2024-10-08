"use client"

import BoardCard from "./_components/BoardCard"
import CreateBoard from "./_components/CreateBoard"
import { useBoardsStore } from "@/store/board"
import { useEffect } from "react"
import { useFriendsStore } from "@/store/friends"
import { toast } from "sonner"
import { useUserColorsStore } from "@/store/userColors"


function initializeSocketServer() {
    try {
        const response = fetch(process.env.NEXT_PUBLIC_SOCKET_URL + "/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then( (res) => {
            console.log("Socket server response:", res)
        } ).catch( (err) => {
            console.error("Socket server error:", err)
        } )
    } 
    catch (error) {
        console.error("Error initializing socket server:", error);
    }
}


export default function Boards() {
    const [boards, setBoards]= useBoardsStore( state => [state.boards, state.setBoards] )
    // const setFriends= useSetRecoilState(friendsAtom)
    const setFriends= useFriendsStore( state => state.setFriends )
    const setUserColors= useUserColorsStore( state => state.setUserColors )
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
                // console.log("Boards: ", data)
                setBoards(data)
            }
        }

        initializeSocketServer()
        getBoardsList()
        getFriendsList()
    }, [])


    useEffect( () => {
        async function getUserColours () {
            const resp= await fetch(`/api/boards/getColours`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (resp.status !== 200) {
                console.error("Failed to fetch user colours")
                toast.error("Failed to fetch user colours")
            }
            else {
                const data= await resp.json()
                // console.log("User Colours: ", data)
                setUserColors(data)
            }
        }

        getUserColours()

    }, [boards, setUserColors] )


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