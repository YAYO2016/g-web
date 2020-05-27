import Vue from 'vue'
import VueRouter from 'vue-router'

const Layout = () => import('@/views/layout/Layout');

Vue.use(VueRouter);

/**
 * hidden: true                   如果hidden为true则在左侧菜单栏不展示
 * name:'router-name'             路由名称，必须填写
 * meta : {
    title: 'title'               对应路由在左侧菜单栏的标题名称
    icon: 'icon-class'           对应路由在左侧菜单栏的图标样式，样式使用fontawesome图标库
    roles:[xxx,xxx]              可以访问该路由的用户权限，没有该属性的话就是谁都可以访问
  }
 **/

const constantRoutes = [
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
        path: '/register',
        component: () => import('@/views/register/Register'),
        hidden: true
    },
    {
        path: '/forgetPassword',
        component: () => import('@/views/forgetPassword/ForgetPassword'),
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

const asyncRoutes = [
    {
        path: '/user',
        component: Layout,
        redirect: '/user/userManager',
        children: [
            {
                path: '/user/userManager',
                component: () => import('@/views/userManager/UserManager'),
                name: 'UserManager',
                meta: {title: '用户管理', icon: 'el-icon-s-custom',roles: ["admin"]}
            }
        ]
    },

];

const router = new VueRouter({
    routes:new Set([...constantRoutes,...asyncRoutes])
});

export default router
