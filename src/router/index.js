import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"
import {constantRoutes, asyncRoutes} from "./routes";
import {getToken} from "@/common/js/auth";
import api from "@/api"
import util from "@/common/js/util"

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false}); //不显示右侧的转圈圈

// 解决控制台 在使用ElementUi时点击同一个路由，页面报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter);

const router = new VueRouter({
    routes: constantRoutes
});

//白名单
const whiteList = ["/login", "/register", "/forgetPassword"];
// 路由守卫,进行拦截，可以拦截用户设置的权限是路由requireAuth:true的（但是可能token失效了，但是本地还是保存着，所以需要axios拦截配合）
router.beforeEach(async (to, from, next) => {

    NProgress.start();

    //判断cookie中是否有token来判断是否登录
    const token = getToken();
    if (util.TypeFn.isTrue(token)) {
        // token存在，说明登录了
        if (to.path === '/login') {
            //跳转到login页面的话，直接跳转到/主页去，然后重新执行了一次beforeEach
            next({path: '/'});

            NProgress.done()
        } else {
            //根据store中的userInfo信息是否存在，来判断页面是否刷新了
            const userInfo = store.state.user.userInfo;
            if (userInfo) {
                next();
            } else {
                try {
                    //如果roles不存在的时候，就去调用接口获取用户的roles
                    await store.dispatch("user/getUserInfo");
                    //根据用户的roles去过滤出可以访问的路由
                    const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.userRoles);
                    //将获取到路由参数添加到路由中
                    router.addRoutes(accessRoutes);
                    next({...to, replace: true});
                    NProgress.done()
                } catch (e) {
                    store.dispatch("user/clearCurrentState");
                    // 用户没有登录
                    next(`/login?redirect=${to.path}`);
                    NProgress.done()
                }
            }
        }
    } else {
        //token不存在，说明没有登录
        //没有token,然后判断是否在白名单中
        if (whiteList.indexOf(to.path) !== -1) {
            //在白名单可以访问
            next();
        } else {
            //不在白名单中就跳转到login,并且清除用户信息
            store.dispatch("user/clearCurrentState");
            // 用户没有登录
            next(`/login?redirect=${to.path}`);

            NProgress.done()
        }
    }
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
    NProgress.done()
});

export default router
