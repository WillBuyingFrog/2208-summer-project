import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('../components/HomeComponent')
    // },
    // {
    //     path: '/test1',
    //     name: 'Test1',
    //     component: () => import('../components/TestComponent')
    // },
    {
        path: '/',
        name: 'Homepage',
        component: () => import('../views/homepage/HomePage')
    },
    {
        path: '/workspace',
        name: 'workSpace',
        component: () => import('../views/WorkSpace')
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router