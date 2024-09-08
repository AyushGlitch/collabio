import { Board } from "@/types/Board";
import { atom, selector } from "recoil";


// async function getBoardsList() {
//     const resp= await fetch(`/api/boards/list`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })

//     if (resp.status !== 200) {
//         console.error("Failed to fetch boards")
//     }
//     else {
//         const data= await resp.json()
//         return data
//     }
// }


export const boardsAtom= atom<Board[]> ({
    key: "boards",
    default: []
    // selector({
    //     key: "boardsSelector",
    //     get: async () => {
    //         return await getBoardsList()
    //     }
    // })
})