import { Button } from "@/components/ui/button";



export default function NoteCard( {note}: {note: Note} ) {
    return (
        <div className="bg-slate-700 group p-3 aspect-square h-100 rounded-3xl flex flex-col gap-2 overflow-x-hidden no-scrollbar hover:scale-105">
            <div className="flex flex-col bg-slate-800 px-5 overflow-x-auto no-scrollbar rounded-3xl h-1/6">
                <p className="text-xl font-bold"><span className="underline text-xl">Title:</span> {note.noteTitle}</p>
                <div className="flex gap-3">
                    <p className="text-base font-medium"><span className="font-bold underline">Note Id: </span>{note.noteId}</p>
                    <p className="text-base font-medium"><span className="font-bold underline">Board Id: </span>{note.boardId}</p>
                </div>
            </div>

            <div className="bg-slate-800 whitespace-pre-wrap text-base overflow-y-auto no-scrollbar rounded-3xl px-3 h-4/6">
                
            </div>

            <div className=" w-full flex justify-around">
                <Button className="bg-blue-400 w-32 font-bold text-base">
                    Edit
                </Button>

                <Button className="bg-rose-400 w-32 font-bold text-base">
                    Delete
                </Button>
            </div>
        </div>
    )
}