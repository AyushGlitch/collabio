import { User } from "@/types/User";
import { create } from "zustand";

type friendsState= {
    friends: User[],
}

type friendsStoreType= {
    friends: User[],
    setFriends: (friends: friendsState['friends']) => void,
    addFriend: (friend: User) => void,
    getFriends: () => friendsState['friends']
}

export const useFriendsStore= create<friendsStoreType>() ( (set, get) => ({
    friends: [],
    getFriends: () => get().friends,
    setFriends: (friends) => {
        set( () => ({
            friends: friends
        }) )
    },
    addFriend: (friend) => {
        set( (state) => ({
            friends: [...state.friends, friend]
        }) )
    }
}) )