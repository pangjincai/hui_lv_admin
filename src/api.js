import axios from 'axios'

// Create Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api/admin', // Adjust port if server runs purely on Go port
    timeout: 10000
})

// Request Interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// Response Interceptor
api.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    return Promise.reject(error)
})

export default api
