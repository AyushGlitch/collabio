import { User } from "@/types/User";
// import { atom } from "recoil";
import { create } from "zustand"

// export const userAtom= atom<User>({
//     key: 'user',
//     default: {
//         id: "",
//         name: "",
//         email: "",
//         image: "",
//     }
// })


type userState= {
    user: User
}

type userStoreType= {
    user: User,
    userColour: string,
    setUser: (user: userState['user']) => void,
    getUser: () => userState['user']
}


function selectUserColour() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}


export const useUserStore= create<userStoreType>() ( (set, get) => ( {
    user: {
        id: "",
        name: "",
        email: "",
        image: ""
    },
    userColour: selectUserColour(),
    setUser: (user) => {
        set( () => ({
            user: user
        }) )
    },
    getUser: () => get().user,
    getUserColour: () => get().userColour
} ) )