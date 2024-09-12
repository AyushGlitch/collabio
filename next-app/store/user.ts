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
    setUser: (user: userState['user']) => void,
    getUser: () => userState['user']
}


export const useUserStore= create<userStoreType>() ( (set, get) => ( {
    user: {
        id: "",
        name: "",
        email: "",
        image: ""
    },
    setUser: (user) => {
        set( () => ({
            user: user
        }) )
    },
    getUser: () => get().user
} ) )