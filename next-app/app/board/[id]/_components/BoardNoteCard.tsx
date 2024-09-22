import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotesStore } from "@/store/notes";
import { Eraser, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";



export default function BoardNoteCard ({note, boardId, socket} : {note: Note, boardId: string, socket: Socket|null}) {
    const [notes, getNotes, modifyNote, deleteNote]= useNotesStore( state => [state.notes, state.getNotes, state.modifyNote, state.deleteNote] )

    const [noteTitle, setNoteTitle]= useState(note.noteTitle)
    const [noteBody, setNoteBody]= useState(note.noteBody)

    async function handleDeleteNote (noteId: string) {
        const resp= await fetch(`/api/notes/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ noteId: noteId })
        })

        if (resp.status !== 200) {
            toast.error("Failed to delete note")
            console.error("Failed to delete note")
        }
        else {
            deleteNote(noteId)
            toast.success("Note deleted")
            console.log("Note deleted")
        }
    }

    async function handleSaveNote (noteId: string) {
        const latestNote= notes.find( (n) => n.noteId === noteId )
        if (latestNote) {
            const resp= await fetch(`/api/notes/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ noteId: noteId, title: latestNote.noteTitle, body: latestNote.noteBody })
            })

            if (resp.status !== 200) {
                toast.error("Failed to save note")
                console.error("Failed to save note")
            }
            else {
                toast.success("Note saved")
                console.log("Note saved")
            }
        }
    }



    useEffect( () => {
        socket?.on("note-modified", (data: Note) => {
            modifyNote(data)
            setNoteTitle(() => data.noteTitle)
            setNoteBody(() => data.noteBody)
        })
    }, [] )

    return (
        <CarouselItem key={note.noteId}>
            <Card className="bg-slate-800">
                <CardContent className="flex flex-col aspect-square p-1 justify-between">
                    <div className="flex h-[10%] justify-between items-center gap-2">
                        <Input placeholder="Title" className="w-full h-full text-base font-semibold" value={note.noteTitle} onChange={(e) => {
                            setNoteTitle(e.target.value)
                            modifyNote({ ...note, noteTitle: e.target.value })
                            socket?.emit("note-modified", { ...note, noteTitle: e.target.value })
                        }} />
                        <Eraser size={30} className="hover:scale-110 align-baseline cursor-pointer" onClick={() => {
                            setNoteTitle("")
                            modifyNote({ ...note, noteTitle: "" })
                            socket?.emit("note-modified", { ...note, noteTitle: "" })
                        }} />
                    </div>
                    <div className="flex gap-2 justify-center items-center h-[87%] w-full">
                        <Textarea placeholder="Write your notes here..." className="h-full" value={note.noteBody} onChange={(e) => {
                            setNoteBody(e.target.value)
                            modifyNote({ ...note, noteBody: e.target.value })
                            socket?.emit("note-modified", { ...note, noteBody: e.target.value })
                        }} />
                        <div className="h-3/5 gap-3 flex flex-col justify-around">
                            <Eraser size={30} className="hover:scale-110 align-baseline cursor-pointer" onClick={() => {
                                setNoteBody("")
                                modifyNote({ ...note, noteBody: "" })
                                socket?.emit("note-modified", { ...note, noteBody: "" })
                            }} />
                            <Save size={30} className="text-blue-500 hover:scale-110 align-baseline cursor-pointer" onClick={() => {
                                note.noteTitle= noteTitle
                                note.noteBody= noteBody
                                modifyNote({ ...note, noteTitle: noteTitle, noteBody: noteBody })
                                socket?.emit("note-modified", { ...note, noteTitle: noteTitle, noteBody: noteBody })
                                handleSaveNote(note.noteId)
                            }} />
                            <Trash2 size={30} className="text-red-500 hover:scale-110 align-baseline cursor-pointer" onClick={() => handleDeleteNote(note.noteId)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </CarouselItem>
    )
}