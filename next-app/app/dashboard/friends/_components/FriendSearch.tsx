"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User } from "@/types/User";


// Mock API function for demonstration (replace with your actual API call)
async function searchFriends(searchTerm: string) {
    const response = await fetch(`/api/friends/search`, {
        method: 'POST',
        body: JSON.stringify({ searchTerm }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

// Debounce function
function debounce(func: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout;
    
    return (...args: any[]) => {
        if (timer) 
            clearTimeout(timer);

        timer = setTimeout(() => {
            func(...args);

        }, delay);
    };
}

export default function FriendSearch() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [data, setData] = useState<User[]>([]);

    useEffect(() => {
        const debouncedSearch = debounce(async (term: string) => {
            if (term) {
                const results = await searchFriends(term);
                setData(results);
            } else {
                setData([]);
            }
        }, 200);

        debouncedSearch(searchTerm);
    }, [searchTerm]);


    async function handleAddFriend(id: string) {
        const response= await fetch('/api/friends/add', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            toast.success('Friend request sent successfully');
        }
        else {
            toast.error('Failed to send friend request');
        }
    }


    return (
        <div className="flex flex-col gap-5 justify-center py-5 px-3 bg-slate-700 rounded-3xl h-full">
            <Input
                placeholder="Search ..."
                type="text"
                className="text-lg font-semibold h-[10%]"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Command className="bg-blue-30">
                <CommandList className="bg-zinc-700 max-h-[60vh]">
                    {data.length === 0 ? (
                        <CommandEmpty>No results found.</CommandEmpty>
                    ) : (
                        data.map((user) => (
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
                                <Button onClick={() => handleAddFriend(user.id)}>Add Friend</Button>
                            </CommandItem>
                        ))
                    )}
                </CommandList>
            </Command>
        </div>
    );    
}
