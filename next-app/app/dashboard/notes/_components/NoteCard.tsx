import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBoardsStore } from "@/store/board";
import { useNotesStore } from "@/store/notes";
import { useState } from "react";
import { toast } from "sonner";



export default function NoteCard( {note}: {note: Note} ) {
    const [boards]= useBoardsStore( state => [state.boards] )
    const [notes, deleteNote, modifyNote]= useNotesStore( state => [state.notes, state.deleteNote, state.modifyNote] )
    const [noteTitle, setNoteTitle]= useState<string>(note.noteTitle)
    const [noteBody, setNoteBody]= useState<string>(note.noteBody)

    async function handleDeleteNote (noteId: string) {
        const resp= await fetch(`/api/notes/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ noteId: noteId, boardId: note.boardId })
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


    async function handleSaveEditNote (noteId: string, title: string, body: string) {
        const resp= await fetch(`/api/notes/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ noteId, title, body })
        })

        if (resp.status !== 200) {
            toast.error("Failed to edit note")
            console.error("Failed to edit note")
        }
        else {
            note.noteTitle= title
            note.noteBody= body
            modifyNote(note)
            toast.success("Note edited")
            console.log("Note edited")
        }
    }

    return (
        <div className="bg-slate-700 group p-3 aspect-square h-100 rounded-3xl flex flex-col gap-2 overflow-x-hidden no-scrollbar hover:scale-105">
            <div className="flex flex-col bg-slate-800 px-5 overflow-x-auto no-scrollbar rounded-3xl h-1/6">
                <p className="text-xl font-bold"><span className="underline text-xl">Title:</span> {note.noteTitle}</p>
                <p className="text-base font-medium"><span className="font-bold underline">Board Title:</span> {
                    boards.find( (board) => board.boardId === note.boardId )?.boardTitle
                }</p>
                <p className="text-base font-medium"><span className="font-bold underline">Note Id:</span> {note.noteId}</p>
            </div>

            <div className="bg-slate-800 whitespace-pre-wrap text-base overflow-y-auto no-scrollbar rounded-3xl px-3 py-2 h-4/6">
                {note.noteBody}
            </div>

            <div className=" w-full flex justify-around">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-400 w-32 font-bold text-base">
                            Edit
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-xl">
                                Edit the note
                            </DialogTitle>
                            <DialogDescription>
                                Edit the following details of the note
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-4">
                            <div className="grid grid-cols-6 items-center gap-4">
                                <Label htmlFor="boardTitle" className="text-right text-base font-medium">
                                    Board Title
                                </Label>
                                <Input
                                    id="boardTitle"
                                    placeholder="Board Title"
                                    className="col-span-2 font-medium"
                                    value={
                                        boards.find( (board) => board.boardId === note.boardId )?.boardTitle
                                    }
                                    disabled={true}
                                />

                                <Label htmlFor="boardId" className="text-right text-base font-medium">
                                    Board ID
                                </Label>
                                <Input
                                    id="boardId"
                                    placeholder="Board ID"
                                    className="col-span-2 font-medium"
                                    value={note.boardId}
                                    disabled={true}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="noteTitle" className="text-right text-base font-medium">
                                    Note Title
                                </Label>
                                <Input
                                    id="noteTitle"
                                    placeholder="Edit the note title"
                                    className="col-span-3 font-medium"
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="noteBody" className="text-right text-base font-medium">
                                    Note Content
                                </Label>
                                <Textarea
                                    id="noteBody"
                                    placeholder="Edit the note content"
                                    className="col-span-3 font-medium whitespace-pre-wrap h-60 no-scrollbar"
                                    value={noteBody}
                                    onChange={(e) => setNoteBody(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-4">
                            <DialogClose asChild>
                                <Button className="bg-emerald-400" onClick={() => handleSaveEditNote(note.noteId, noteTitle, noteBody)}>
                                    Save
                                </Button>
                            </DialogClose>

                            <DialogClose asChild>
                                <Button className="bg-rose-400">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button className="bg-rose-400 w-32 font-bold text-base" onClick={() => handleDeleteNote(note.noteId)}>
                    Delete
                </Button>
            </div>
        </div>
    )
}