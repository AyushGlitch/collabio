import Message from "@/types/Message"
import { create } from "zustand"


type MessagesState = {
    [key: string]: Message[]
}


type messagesStoreType = {
    messages: MessagesState,
    setMessages: (boardId: string, messages: Message[]) => void,
    addMessage: (boardId: string, message: Message) => void,
    getMessages: (boardId: string) => Message[],
    setAllMessages: (messages: MessagesState) => void,
    getAllMessages: () => MessagesState
}


export const useMessagesStore = create<messagesStoreType>()((set, get) => ({
    messages: {},
    
    getMessages: (boardId) => get().messages[boardId] || [],

    setMessages: (boardId, messages) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [boardId]: messages
            }
        }));
    },
    
    addMessage: (boardId, message) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [boardId]: state.messages[boardId] ? [...state.messages[boardId], message] : [message]
            }
        }));
    },
    setAllMessages(messages) {
        set(() => ({
            messages: messages
        }));
    },
    getAllMessages() {
        return get().messages
    },
}));
