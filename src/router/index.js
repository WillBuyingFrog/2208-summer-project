import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Homepage',
        component: () => import('../views/homepage/HomePage')
    },
    {
        path: '/workspace',
        name: 'workSpace',
        component: () => import('../views/WorkSpace')
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
    },
    {
        path: '/allproject',
        name: '/allproject',
        component: () => import('../views/AllProject'),
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router