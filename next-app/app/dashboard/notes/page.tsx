"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useNotesStore } from "@/store/notes"
import NoteCard from "./_components/NoteCard"
import { useBoardsStore } from "@/store/board"


export default function Notes() {
    const [notes, setNotes]= useNotesStore( state => [state.notes, state.setNotes] )
    const [setBoards]= useBoardsStore( state => [state.setBoards] )

    useEffect( () => {
        async function getNotesList() {
            const resp= await fetch(`/api/notes/list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (resp.status !== 200) {
                console.error("Failed to fetch notes")
                toast.error("Failed to fetch notes")
            }
            else {
                const data= await resp.json()
                console.log(data)
                setNotes(data)
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
        getNotesList()
    }, [] )


    return (
        <div className="bg-slate-600 p-2 grid grid-cols-3 overflow-y-auto h-full gap-4 max-h-[71vh] no-scrollbar rounded-3xl">
            {
                notes.length === 0 ? (
                    <h1 className="text-2xl font-semibold text-center text-white col-span-3 my-auto">No Notes...!!!</h1>
                ) : (
                    notes.map( (note) => (
                        <NoteCard key={note.noteId} note={note} />
                    ) )
                )
            }
        </div>
    )
}