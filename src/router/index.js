import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Homepage',
        component: () => import('../views/homepage/HomePage')
    },
    {
        path: '/documentCenter',
        name: 'documentCenter',
        component: () => import('../views/document-center/DocumentCenter')
    },
    {
        path: '/try',
        name: 'lightbulb',
        component: () => import('../components/TestComponent')
    },
    // {
    //     path: '/h2',
    //     name: 'home2',
    //     component: () => import('../views/homepage/Home2')
    // },
    // {
    //     path: '/',
    //     name: 'LightComponent',
    //     component: () => import('../views/homepage/LightComponent')
    // },
    {
        path: '/prototypeDesign',
        name: 'PrototypeDesign',
        component: () => import('../views/prototype-design/PrototypeDesign')
    },
    {
        path: '/documentEdit',
        name: 'DocumentEdit',
        component: () => import('../views/document-edit/DocumentEdit')
    },
    {
        path: '/ptest',
        name: 'DesignAppTest',
        component: () => import('../views/prototype-design/DesignApp')
    },
    {
        path: '/team',
        name: 'TeamInfo',
        component: () => import('../views/TeamManage/TeamInfo.vue')
    },
    {
        path: '/team/member',
        name: 'MemberInfo',
        component: () => import('../views/TeamManage/MemberInfo.vue')

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
        component: () => import('../views/project/AllProject'),
    },
    {
        path: '/project',
        name: 'project',
        component: () => import('../views/project/Project'),
        children:[{
            path:'/projectfile',
            name:'projectfile',
            component: () => import('../views/project/ProjectFile'),
          },{
            path:'/projectinfo',
            name:'projectinfo',
            component: () => import('../views/project/ProjectInfo'),
          }
        ]
    },
    {
        path: '/dtest',
        name: 'TextEditorTest',
        component: () => import('../components/TipTapDemo')
    },
    {
        path: '/test',
        component: () => import('../views/TeamManage/TestVue.vue')
        
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
