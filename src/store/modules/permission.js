import {asyncRoutes, constantRoutes} from "../../router/routes";

/**
 * Created by yanyue on 2020/3/25 22:46
 */

/**
 * 判断用户是否有权限访问该路由
 * @param roles 所有角色
 * @param route 当前路由对象
 */
export function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        //如果meta.roles包含角色key值，如果包含就有权限true，否则无权限false
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        //没有meta.roles的就是默认不设置权限
        return true;
    }
}

/**
 * 递归获取满足条件的路由数组
 * @param routes
 * @param roles
 * @returns {Array}
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];
    routes.forEach(route => {
        const tmp = {...route};
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    });
    return res
}

//权限相关 -- 主要是路由访问权限
const permission = {
    namespaced: true,
    state: {
        addRoutes: [],
        routes: [],
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes;
            state.routes = constantRoutes.concat(routes);
        }
    },
    actions: {
        //根据用户权限生成动态路由
        generateRoutes({commit}, roles) {
            return new Promise(resolve => {
                let accessedRoutes;
                if (roles.includes('admin')) {
                    accessedRoutes = asyncRoutes || []
                } else {
                    accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                }
                commit('SET_ROUTES', accessedRoutes);
                resolve(accessedRoutes)
            })
        },
    },
    getters: {}
};

export default permission;
