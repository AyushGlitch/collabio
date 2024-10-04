import { create } from "zustand"



type userColorsState= {
    boardId: string,
    color: string,
}


type userColorsStoreType= {
    userColors: userColorsState[],
    setUserColors: (userColors: userColorsState[]) => void,
    getUserColors: () => userColorsState[],
    getUserColor: (boardId: string) => string,
    setUserColor: (boardId: string, color: string) => void,
}


export const useUserColorsStore= create<userColorsStoreType>() ( (set, get) => ( {
    userColors: [],
    setUserColors: (userColors) => {
        set( () => ({
            userColors: userColors
        }) )
    },
    getUserColors: () => get().userColors,
    getUserColor: (boardId) => {
        const userColors= get().userColors
        const color= userColors.find( (uc) => uc.boardId === boardId )
        return color ? color.color : "black"
    },
    setUserColor: (boardId, color) => {
        const userColors= get().userColors
        const index= userColors.findIndex( (uc) => uc.boardId === boardId )
        if (index !== -1) {
            userColors[index].color= color
        }
        else {
            userColors.push({ boardId: boardId, color: color })
        }
        set( () => ({
            userColors: userColors
        }) )
    }
}) )