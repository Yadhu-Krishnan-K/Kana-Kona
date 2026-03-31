import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from "socket.io-client";
import ResetPassword from '../pages/ForgotPassword/ResetPassword';

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isResettingPassword: false,
    openOtpPage: false,
    // authRefEmail: null,
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
            console.log('res🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ====', res)
            localStorage.setItem("otpEmail", data.email)
            if (res.data.success) {
                set({ openOtpPage: true })
                return true
            } else {
                toast.error(res.data.message)
                return false
            }
        } catch (error) {
            toast.error(error.response.data.message)
            set({ isSigningUp: false })
            set({ openOtpPage: false })
            return false
        }

    },


    verifyOtp: async (data) => {
        try {
            data.email = localStorage.getItem("otpEmail")
            const res = await axiosInstance.post('/auth/verifyOtp', data)
            set({ authUser: res.data })
            localStorage.removeItem("otpEmail")
            get().connectSocket()
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            set({ isSigningUp: false })
            set({ openOtpPage: false })
        } finally {
            set({ isSigningUp: false })
            set({ openOtpPage: false })
        }
    },


    login: async (data) => {
        try {
            set({ isLoggingIn: true })
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
            get().connectSocket()
            return true;
        } catch (error) {
            // if(error.status!==500){
            console.log('error = ', error)
            toast.error(error.response.data.message)
            return false
            // }
        } finally {
            set({ isLoggingIn: false })
        }
    },

    forgotPassword: async (email) => {
        try {
            console.log('going ot setn')
            localStorage.setItem("forgotPasswordEmail",email)
            const res = await axiosInstance.post("/auth/forgot-password",{email})
            if(res.data.success){
                set({isResettingPassword: true})
            }
            return true
        } catch (error) {
            console.log('error = ',error);
            set({isResettingPassword: false});
            toast.error(error.response.data.message);
            return false
        }
    },

    
    resetPassword: async (data) => {
        try {
            const email = localStorage.getItem("forgotPasswordEmail")
            data.email = email
            const res = await axiosInstance.patch("/auth/reset-password",data)
            if(res.data.success){
                set({isResettingPassword: false})
                localStorage.removeItem("forgotPasswordEmail")
                toast.success(res.data.message)
            }
            return true
        } catch (error) {
            console.log('error = ',error)
            toast.error(error.response.data.message)
            return false
        }
    },


    updateProfile: async (data) => {
        try {
            const formData = new FormData()
            formData.append("image", data.profilePic)
            set({ isUpdatingProfile: true })
            const res = await axiosInstance.patch('/auth/update-profile',
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            set({ authUser: res.data })
            toast.success("Profile Updated Successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
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
            console.log('error: socketconnection error: ', error)
        }

    },


    disConnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }


}))