import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../components/HomeComponent')
    },
    {
        path: '/test1',
        name: 'Test1',
        component: () => import('../components/TestComponent')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router