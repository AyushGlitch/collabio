import { User } from "@/types/User";
import { atom } from "recoil";


async function fetchFriends() {
    const resp= await fetch(`/api/friends/get`)
    if (resp.status !== 200) {
        console.error('Failed to fetch friends')
        return []
    }
    else {
        const data= await resp.json()
        return data
    }
}


export const friendsAtom= atom<User[]>({
    key: 'friends',
    default: fetchFriends()
})