import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.error('error == ', error)
            set({ authUser: null })
            toast.error(error.response.data.message)
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (data) => {
        try {
            set({ isSigningUp: true })
            const res = await axiosInstance.post('/auth/signup', data)
            set({ authUser: res.data })
            get().connectSocket()
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            set({ isSigningUp: false })
        } finally {
            set({ isSigningUp: false })
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.get('/auth/logout')
            set({ authUser: null });
            toast.success("Logged out successfully")
            get().disConnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true })
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
            get().connectSocket()
        } catch (error) {
            // if(error.status!==500){
            toast.error(error.response.data.message)
            // }
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (data) => {
        try {
            const formData = new FormData()
            formData.append("image",data.profilePic)
            set({ isUpdatingProfile: true })
            const res = await axiosInstance.patch('/auth/update-profile', 
                formData,
                {headers:{
                    "Content-Type":"multipart/form-data"
                }}
            )
            set({ authUser: res.data })
            toast.success("Profile Updated Successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        try {
            const { authUser } = get()
            if (!authUser || get().socket?.connected) return
            const socket = io(BASE_URL, {
                auth: {
                    userId: authUser._id
                }
            });
            socket.connect();

            set({ socket: socket })

            socket.on("getOnlineUsers", (userIds) => {
                set({ onlineUsers: userIds })
            })
        } catch (error) {
            console.log('error: socketconnection error: ',error)
        }

    },

    disConnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }

}))