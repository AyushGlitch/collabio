import { User } from "@/types/User";
import { atom, selector } from "recoil";

// async function getFriendsList() {
//     const resp= await fetch(`/api/friends/list`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })

//     if (resp.status !== 200) {
//         console.error("Failed to fetch friends")
//     }
//     else {
//         const data= await resp.json()
//         return data
//     }
// }

export const friendsAtom= atom<User[]>({
    key: 'friends',
    default: []
    // selector({
    //     key: "friendsSelector",
    //     get: async () => {
    //         return await getFriendsList()
    //     }
    // })
})