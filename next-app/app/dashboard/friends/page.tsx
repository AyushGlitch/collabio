import React from "react";
import FriendList from "./_components/FriendList";
import FriendRequest from "./_components/FriendRequest";
import FriendSearch from "./_components/FriendSearch";
import Loader from "@/components/Loader";


export default function Friends() {
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