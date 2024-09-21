import { create } from "zustand"



type notesState= {
    notes: Note[]
}

type notesStoreType= {
    notes: Note[],
    setNotes: (notes: notesState['notes']) => void,
    addNote: (note: Note) => void,
    getNotes: () => notesState['notes'],
    modifyNote: (note: Note) => void,
    deleteNote: (noteId: string) => void,
}


export const useNotesStore= create<notesStoreType>() ( (set, get) => ({
    notes: [],
    getNotes: () => get().notes,
    setNotes: (notes) => {
        set( () => ({
            notes: notes
        }) )
    },
    addNote: (note) => {
        set( (state) => ({
            notes: [...state.notes, note]
        }) )
    },
    modifyNote: (note) => {
        set( (state) => ({
            notes: state.notes.map( (n) => n.noteId === note.noteId ? note : n )
        }) )
    },
    deleteNote: (noteId) => {
        set( (state) => ({
            notes: state.notes.filter( (n) => n.noteId !== noteId )
        }) )
    }
}) )