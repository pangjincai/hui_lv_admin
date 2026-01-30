import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import DepositMgr from '../views/DepositMgr.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/',
            component: () => import('../layout/MainLayout.vue'),
            meta: { requiresAuth: true },
            redirect: '/dashboard',
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue')
                },
                {
                    path: 'admins',
                    name: 'admins',
                    component: () => import('../views/UserMgr.vue')
                },
                {
                    path: 'exchange-rates',
                    name: 'exchange-rates',
                    component: () => import('../views/RateMgr.vue')
                },
                {
                    path: 'banks',
                    name: 'banks',
                    component: () => import('../views/BankMgr.vue')
                },
                {
                    path: 'bank-rates',
                    name: 'bank-rates',
                    component: () => import('../views/BankRateMgr.vue')
                },
                {
                    path: 'currencies',
                    name: 'currencies',
                    component: () => import('../views/CurrencyMgr.vue')
                },
                {
                    path: 'deposits',
                    name: 'deposits',
                    component: DepositMgr
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.token) {
        next('/login')
    } else {
        next()
    }
})

export default router
