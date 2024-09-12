"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useFriendsStore } from "@/store/friends"; // Use Zustand store
import { User } from "@/types/User";
import { LucideLoader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FriendList() {
    const { friends, setFriends } = useFriendsStore(); // Use Zustand store
    const [loading, setLoading] = useState<boolean>(false);

    const handleRemoveFriend = async (id: string) => {
        setLoading(true);
        const resp = await fetch(`/api/friends/remove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId: id }),
        });
        setLoading(false);
        if (resp.status !== 200) {
            console.error("Failed to remove friend");
            toast.error("Failed to remove friend");
        } else {
            const updatedFriends = friends.filter((friend) => friend.id !== id);
            setFriends(updatedFriends);
            toast.success("Friend removed");
        }
    };

    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            {loading ? ( // Display loader if loading
                <div className="flex justify-center items-center">
                    <LucideLoader className="animate-spin text-white" size={32} />
                </div>
            ) : (
                <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList className="overflow-y-auto bg-zinc-700 max-h-[60vh]">
                        <CommandEmpty>No results found.</CommandEmpty>
                        {friends &&
                            friends.map((friend) => (
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

                                    <div className="flex justify-around items-center w-full">
                                        <Button size={"sm"} onClick={() => handleRemoveFriend(friend.id)} className="bg-rose-400">Remove</Button>
                                    </div>
                                </CommandItem>
                            ))}
                    </CommandList>
                </Command>
            )}
        </div>
    );
}
