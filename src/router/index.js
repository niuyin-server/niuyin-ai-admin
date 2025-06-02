import {createRouter, createWebHistory} from 'vue-router'
import Index from '@/views/index.vue'
import Login from '@/views/auth/login.vue'

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        children: [
            {
                path: "/", name: "index", component: () => import("@/views/index/Index.vue")
            },
            {
                path: "dashboard", name: "dashboard", component: () => import("@/views/dashboard/Index.vue")
            },
            {
                path: "model/key", component: () => import("@/views/model/ModelKey.vue")
            },
            {
                path: "model/model", component: () => import("@/views/model/Model.vue")
            },
            {
                path: "model/role", component: () => import("@/views/model/ModelRole.vue")
            }
            // {
            //     path: "model",
            //     redirect: "model/key",
            //     children: [
            //         {
            //             path: "model/key", component: () => import("@/views/model/ModelKey.vue")
            //         },
            //         {
            //             path: "model/model", component: () => import("@/views/model/Model.vue")
            //         }
            //     ]
            // },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
