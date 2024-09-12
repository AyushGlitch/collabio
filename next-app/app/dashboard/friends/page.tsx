"use client"

import React, { useEffect } from "react";
import FriendList from "./_components/FriendList";
import FriendRequest from "./_components/FriendRequest";
import FriendSearch from "./_components/FriendSearch";
import Loader from "@/components/Loader";
import { useFriendsStore } from "@/store/friends";
import { toast } from "sonner";


export default function Friends() {
    const [friends, setFriends]= useFriendsStore( state => [state.friends, state.setFriends] )

    useEffect( () => {
        async function getFriendsList () {
            const resp= await fetch(`/api/friends/list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        
            if (resp.status !== 200) {
                console.error("Failed to fetch friends")
                toast.error("Failed to fetch friends")
            }
            else {
                const data= await resp.json()
                await setFriends(data)
            }
        }

        getFriendsList()
    }, [] )

    return (
        <div className="bg-slate-800 h-full grid grid-cols-3 gap-3 overflow-y-auto">
            <div>
                <React.Suspense fallback={<Loader size={50} />}>
                    <FriendSearch />
                </React.Suspense>
            </div>
            <div>
                <React.Suspense fallback={<Loader size={50} />}>
                    <FriendList />
                </React.Suspense>
            </div>
            <div>
                <React.Suspense fallback={<Loader size={50} />}>
                    <FriendRequest />
                </React.Suspense>
            </div>
        </div>
    )
}