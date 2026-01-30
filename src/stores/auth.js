import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || ''
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async login(username, password) {
            try {
                const res = await api.post('/login', { username, password })
                if (res.data.code === 1) {
                    this.token = res.data.data.token
                    localStorage.setItem('token', this.token)
                    return { success: true }
                } else {
                    return { success: false, msg: res.data.msg }
                }
            } catch (error) {
                return { success: false, msg: error.message }
            }
        },
        logout() {
            this.token = ''
            localStorage.removeItem('token')
            // window.location.href = '/login' // Router will handle
        }
    }
})
