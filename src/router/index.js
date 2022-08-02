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
    },{
        path: '/team',
        name: 'TeamInfo',
        component: () => import('../views/TeamManage/TeamInfo.vue')
    },{
        path: '/team/member',
        name: 'MemberInfo',
        component: () => import('../views/TeamManage/MemberInfo.vue')
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router