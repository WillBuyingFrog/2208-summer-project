import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Homepage',
        component: () => import('../views/homepage/HomePage')
    },
    {
        path: '/login',
        name: 'SignIn',
        component: () => import('../views/user-sign/SignIn.vue'),
        meta: {
            requireNotAuth: true,
            noNav: true
        }
    },
    {
        path: '/register',
        name: 'SignUp',
        component: () => import('../views/user-sign/SignUp.vue'),
        meta: {
            requireNotAuth: true,
            noNav: true
        }
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router