import { create } from "zustand";
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isTyping: false,

    getUsers: async () => {
        try {
            set({ isUserLoading: true })
            const res = await axiosInstance.get('/messages/users')
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true })
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message)

        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        try {
            console.log('sending message...')
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.off("newMessage")
        socket.off("typing")

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return

            set(state => ({
                messages: [...state.messages, newMessage]
            }))
        })

        socket.on("typing", (val) => {
            set({ isTyping: val })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("typing")
    },

    //todo: optimise this later
    setSelectedUser: async (selectedUser) => {
        set({ selectedUser })
    }
}))