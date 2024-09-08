import { User } from "@/types/User";
import { atom } from "recoil";


export const userAtom= atom<User>({
    key: 'user',
    default: {
        id: "",
        name: "",
        email: "",
        image: "",
    }
})