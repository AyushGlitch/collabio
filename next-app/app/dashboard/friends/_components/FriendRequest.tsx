"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useFriendsStore } from "@/store/friends"; // Use the Zustand store
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FriendRequest() {
    const { friends, setFriends, addFriend } = useFriendsStore(); // Use Zustand store
    const [friendRequests, setFriendRequests] = useState<User[]>([]);

    useEffect(() => {
        async function fetchFriendRequests() {
            const resp = await fetch("/api/friends/requests");
            if (resp.status !== 200) {
                toast.error("Failed to fetch friend requests");
            } else {
                const data = await resp.json();
                setFriendRequests(data);
            }
        }

        fetchFriendRequests();
    }, []);

    async function handleAcceptRequest(id: string) {
        const resp = await fetch(`/api/friends/requests/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId: id }),
        });

        if (resp.status !== 200) {
            toast.error("Failed to accept friend request");
        } else {
            toast.success("Friend request accepted");
            const newFriend: User = await resp.json();
            addFriend(newFriend); // Add friend to Zustand store
            setFriendRequests((prev) => prev.filter((user) => user.id !== id));
        }
    }

    async function handleRejectRequest(id: string) {
        const resp = await fetch(`/api/friends/requests/reject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId: id }),
        });

        if (resp.status !== 200) {
            toast.error("Failed to reject friend request");
        } else {
            toast.success("Friend request rejected");
            setFriendRequests((prev) => prev.filter((user) => user.id !== id));
        }
    }

    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="overflow-y-auto max-h-[60vh] bg-zinc-700">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {friendRequests.length > 0 &&
                        friendRequests.map((user) => (
                            <CommandItem key={user.id} className="flex flex-col justify-center items-center gap-3">
                                <div className="flex gap-2 justify-between items-center w-full">
                                    <div className="flex flex-col justify-center items-start">
                                        <h1 className="font-medium text-base">
                                            <span className="font-semibold text-lg">Name: </span>
                                            {user.name.length > 18 ? user.name.slice(0, 15) + "..." : user.name}
                                        </h1>
                                        <h1 className="font-medium text-base">
                                            <span className="font-semibold text-lg">Email: </span>
                                            {user.email.length > 18 ? user.email.slice(0, 15) + "..." : user.email}
                                        </h1>
                                    </div>

                                    <div>
                                        <Avatar>
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <div className="flex justify-around items-center w-full">
                                    <Button size={"sm"} onClick={() => handleAcceptRequest(user.id)} className="bg-emerald-400">Accept</Button>
                                    <Button size={"sm"} onClick={() => handleRejectRequest(user.id)} className="bg-rose-400">Reject</Button>
                                </div>
                            </CommandItem>
                        ))}
                </CommandList>
            </Command>
        </div>
    );
}
