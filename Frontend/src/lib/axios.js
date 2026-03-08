import axios from 'axios'

export const axiosInstance = axios.create({
    // baseURL:"http://localhost:5001/api",
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials:true // to send cookies
})