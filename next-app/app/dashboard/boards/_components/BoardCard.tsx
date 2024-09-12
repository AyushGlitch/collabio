"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { boardsAtom } from "@/store/board";
import { useUserStore } from "@/store/user";
import { Board } from "@/types/Board";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";


export default function BoardCard ({board} : {board: Board}) {
    const [members, setMembers]= useState<User[]>([])
    const [boards, setBoards]= useRecoilState(boardsAtom)
    // const currUser= useRecoilValue(userAtom)
    const currUser= useUserStore( state => state.getUser() )
    // console.log("currUser", currUser)
    const router= useRouter()

    useEffect( () => {
        async function getBoardMembers () {
            const resp= await fetch(`/api/boards/list/members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ membersId: board.membersId })
            })

            if (resp.status !== 200) {
                console.error("Failed to fetch board members")
            }
            else {
                const data= await resp.json()
                setMembers(data)
            }
        }

        getBoardMembers()
    }, [] )


    async function handleDeleteBoard(boardId: string) {
        const resp= await fetch(`/api/boards/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ boardId })
        })

        if (resp.status !== 200) {
            console.error("Failed to delete board")
            toast.error("Failed to delete board")
        }
        else {
            toast.success("Board deleted")
            const updatedBoards= boards.filter( (board) => board.boardId !== boardId)
            setBoards(updatedBoards)
        }
    }


    async function handleLeaveBoard(boardId: string) {
        const resp= await fetch(`/api/boards/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ boardId })
        })

        if (resp.status !== 200) {
            console.error("Failed to leave board")
            toast.error("Failed to leave board")
        }
        else {
            toast.success("Board left")
            const updatedBoards= boards.filter( (board) => board.boardId !== boardId)
            setBoards(updatedBoards)
        }
    }


    return (
        <div className="bg-slate-700 group p-4 aspect-square h-100 rounded-3xl flex flex-col gap-2 overflow-x-hidden no-scrollbar hover:scale-105">
            <p className="text-2xl font-bold mb-2 underline">{board.boardTitle}</p>
            <p className="text-base font-medium"><span className="font-bold">Board Id: </span>{board.boardId}</p>
            <div className="text-base font-medium flex items-center">
                <span className="font-bold mr-2">CreatedBy: </span>
                {
                    members.map( (member) => {
                        if (member.id === board.createdBy) {
                            return (
                                <div className="flex gap-2 items-center justify-between w-full" key={member.id}>
                                    <p>{member.name.length>19 ? member.name.slice(0,15) + "A" : member.name}</p>
                                    <Avatar>
                                        <AvatarImage src={member.image} alt={member.name} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            )
                        } 
                    } )
                }
            </div>
            <p className="text-base font-medium"><span className="font-bold">Members Cnt: </span>{board.membersCnt}</p>

            <div className="flex text-base font-medium gap-2">
                <p className="font-bold">Members: </p>
                <div className="flex flex-col gap-1 w-full">
                    {
                        members.map( (member) => {
                            return (
                                <div className="flex gap-2 items-center justify-between w-full" key={member.id}>
                                    <p>{member.name.length>19 ? member.name.slice(0,15) + "A" : member.name}</p>
                                    <Avatar>
                                        <AvatarImage src={member.image} alt={member.name} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            )
                        } )
                    }
                </div>
            </div>
            
            <p className="text-base font-medium"><span className="font-bold">Notes Cnt: </span>{board.notesCnt}</p>
            <p className="text-base font-medium"><span className="font-bold">UpdatedAt: </span>{board.updatedAt.split('T')[0]}</p>
            <p className="text-base font-medium"><span className="font-bold">CreatedAt: </span>{board.createdAt.split('T')[0]}</p>

            <div className="flex justify-around">
                <Button className="bg-emerald-400 w-32 font-bold text-base" onClick={() => router.push(`/board/${board.boardId}`)}>
                    View
                </Button>
                {
                    board.createdBy === currUser.id ? (
                        <Button className="bg-rose-400 w-32 font-bold text-base" onClick={() => handleDeleteBoard(board.boardId)}>
                            Delete
                        </Button>
                    ) : (
                        <Button className="bg-rose-400 w-32 font-bold text-base" onClick={() => handleLeaveBoard(board.boardId)}>
                            Leave
                        </Button>
                    )
                }
            </div>
        </div>
    )
}
