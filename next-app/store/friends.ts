import { User } from "@/types/User";
import { atom } from "recoil";

export const friendsAtom= atom<User[]>({
    key: 'friends',
    default: []
})