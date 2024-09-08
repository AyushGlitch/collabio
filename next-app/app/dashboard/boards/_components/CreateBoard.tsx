import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import AddFriends from "./AddFriends"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"


export default function CreateBoard() {
    const [addedFriends, setAddedFriends]= useState<string[]>([])
    const [boardTitle, setBoardTitle]= useState<string>("")


    function handleAddFriend(id: string) {
        if (addedFriends.includes(id)) {
            const updatedFriends= addedFriends.filter( friendId => friendId !== id)
            setAddedFriends(updatedFriends)
        }
        else {
            setAddedFriends([...addedFriends, id])
        }
    }


    async function handleCreateBoard(boardTitle: string, addedFriends: string[]) {
        const resp= await fetch(`/api/boards/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boardTitle, addedFriends })
        })

        if (resp.status !== 200) {
            console.error("Failed to create board")
            toast.error("Failed to create board")
        }
        else {
            toast.success("Board created")
        }
    }

    function handleResetDailog() {
        setBoardTitle("")
        setAddedFriends([])
    }


    return (
        <Dialog>
            <DialogTrigger>
                <Plus className="group-hover:bg-slate-500 hover:cursor-pointer hover:scale-105 text-white rounded-3xl m-auto" size={"90%"} />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Create a new board
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new board
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-4">
                    <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Board Title
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter board title"
                            className="col-span-5"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Add Friends
                        </Label>

                        <div className="col-span-5">
                            <AddFriends handleAddFriend={handleAddFriend} addedFriends={addedFriends} />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-4">
                    <DialogClose asChild>
                        <Button className="bg-emerald-400" onClick={() => handleCreateBoard(boardTitle, addedFriends)}>
                            Create
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button className="bg-rose-400">
                            Close
                        </Button>
                    </DialogClose>

                    <Button className="bg-blue-400" onClick={() => handleResetDailog()}>
                        Reset
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}