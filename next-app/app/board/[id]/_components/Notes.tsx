import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNotesStore } from "@/store/notes";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import BoardNoteCard from "./BoardNoteCard";



export default function Notes ({socket, boardId} : {socket: Socket|null, boardId: string}) {
    const [notes, addNote, setNotes, getNotes, deleteNote]= useNotesStore( state => [state.notes, state.addNote, state.setNotes, state.getNotes, state.deleteNote] )

    async function handleAddNotes() {
        const resp= await fetch(`/api/notes/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: "New Note", body: "Add Content", boardId: boardId })
        })

        if (resp.status !== 200) {
            toast.error("Failed to create note")
            console.error("Failed to create note")
        }
        else {
            const data= await resp.json()
            addNote(data)
            socket?.emit("new-note-created", { data })
            toast.success("Note created")
            // console.log("Note created")
        }
    }


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
                // console.log(data)
                setNotes(data)
            }
        }

        if (notes.length=== 0) {
            getNotesList()
        }

        socket?.on("add-new-note", (data) => {
            // console.log("New note received", data.data)
            addNote(data.data)
            // console.log("Notes ", getNotes())
        })

        socket?.on("remove-deleted-note", ( noteId ) => {
            deleteNote(noteId.noteId)
            // console.log("Note deleted", noteId.noteId)
        })
    }, [] )

    return (
        <div className="h-full flex flex-col gap-2 py-1 w-full">
            <div className="text-xl py-0.5 font-semibold text-center underline bg-slate-800 mx-2 rounded-3xl">Notes</div>

            <div className="h-full">
                <Carousel className="w-full h-full max-w-xs mx-auto">
                    <CarouselContent className="">
                        <CarouselItem>
                                <Card className="bg-slate-800">
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <Button variant={"ghost"} className="hover:scale-110" onClick={() => handleAddNotes()}>
                                            <PlusIcon size={150} className="bg-slate-700 rounded-3xl" />
                                        </Button>
                                    </CardContent>
                                </Card>
                        </CarouselItem>

                        {
                            notes.length === 0 ? (
                                <CarouselItem key={1000}>
                                        <Card className="bg-slate-800">
                                            <CardContent className="flex flex-col aspect-square p-1 justify-between">
                                                <h1 className="text-2xl font-semibold text-center text-white col-span-3 my-auto">No Notes...!!!</h1>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                            ) : (
                                notes.map( (note) => (
                                    note.boardId === boardId && (
                                        <BoardNoteCard key={note.noteId} note={note} boardId={boardId} socket={socket} />
                                    )
                                )
                            ) )
                        }
                    </CarouselContent>
                    <CarouselPrevious className="-left-9  bg-zinc-600" />
                    <CarouselNext className="-right-9 bg-zinc-600" />
                </Carousel>
            </div>
        </div>
    )
}