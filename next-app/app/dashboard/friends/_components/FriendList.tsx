"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { friendsAtom } from "@/store/friends";
import { useRecoilState } from "recoil";


export default function FriendList() {
    const [friends, setFriends]= useRecoilState(friendsAtom)

    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="overflow-y-auto bg-zinc-700 max-h-[60vh]">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                        friends.map( friend => (
                            <CommandItem key={friend.id} className="flex flex-col justify-center items-center gap-3">
                                    <div className="flex gap-2 justify-between items-center w-full">
                                        <div className="flex flex-col justify-center items-start">
                                            <h1 className="font-medium text-base">
                                                <span className="font-semibold text-lg">Name: </span>
                                                {friend.name.length > 18 ? friend.name.slice(0, 15) + "..." : friend.name}
                                            </h1>
                                            <h1 className="font-medium text-base">
                                                <span className="font-semibold text-lg">Email: </span>
                                                {friend.email.length > 18 ? friend.email.slice(0, 15) + "..." : friend.email}
                                            </h1>
                                        </div>
        
                                        <div>
                                            <Avatar>
                                                <AvatarImage src={friend.image} alt={friend.name} />
                                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                    
                                    {/* <div className="flex justify-around items-center w-full">
                                        <Button onClick={() => handleAcceptRequest(user.id)} className="bg-emerald-400">Accept</Button>
                                        <Button onClick={() => handleRejectRequest(user.id)} className="bg-rose-400">Reject</Button>
                                    </div> */}
                                </CommandItem>
                        ) )
                    }
                </CommandList>
            </Command>
        </div>
    )
}