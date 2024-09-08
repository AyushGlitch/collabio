"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { friendsAtom } from "@/store/friends";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useRecoilState } from "recoil";



export default function AddFriends({handleAddFriend, addedFriends} : {handleAddFriend: (id: string) => void, addedFriends: string[]}) {
    const [friends, setFriends]= useRecoilState(friendsAtom)

    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="overflow-y-auto bg-zinc-700 max-h-[60vh]">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                        friends.length !== 0 && friends.map( friend => (
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

                                    {
                                        addedFriends.includes(friend.id) ? (
                                            <XCircle className="red-500 hover:scale-110 text-red-500" size={30} onClick={() => handleAddFriend(friend.id)} />
                                        ) : (
                                            <CheckCircle2 className="emerald-500 hover:scale-110 text-emerald-500" size={30} onClick={() => handleAddFriend(friend.id)} />
                                        )
                                    }
                                </div>
                            </CommandItem>
                        ) )
                    }
                </CommandList>
            </Command>
        </div>
    )
}