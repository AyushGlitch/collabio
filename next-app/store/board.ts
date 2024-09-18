import { Board } from "@/types/Board";
import { create } from "zustand";


type boardsState= {
    boards: Board[],
}

type boardsStoreType= {
    boards: Board[],
    setBoards: (boards: boardsState['boards']) => void,
    addBoard: (board: Board) => void,
    getBoards: () => boardsState['boards']
}


export const useBoardsStore= create<boardsStoreType>() ( (set, get) => ({
    boards: [],
    getBoards: () => get().boards,
    setBoards: (boards) => {
        set( () => ({
            boards: boards
        }) )
    },
    addBoard: (board) => {
        set( (state) => ({
            boards: [...state.boards, board]
        }) )
    }
}) )