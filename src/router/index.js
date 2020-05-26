import Vue from 'vue'
import VueRouter from 'vue-router'
const Layout = () => import('@/views/layout/Layout');

Vue.use(VueRouter);

const routes = [
    //重定向路由必须放在第一位
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',  //*代表匹配0个或者多个路由
                component: () => import('@/views/redirect/Redirect')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/Login'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/Home'),
                name: 'Home',
                meta: {title: '首页', icon: 'el-icon-s-home'}
            }
        ]
    },

];

const router = new VueRouter({
    routes
});

export default router
