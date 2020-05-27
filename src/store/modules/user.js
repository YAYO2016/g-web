/**
 * Created by yanyue on 2020/5/27 20:03
 */
import {removeToken,setToken,getToken} from "@/common/js/auth";
import api from "@/api"

const user = {
    namespaced: true,
    state: {
        userInfo: null,
    },
    mutations: {
        SET_USERINFO(state, payload) {
            state.userInfo = payload;
        },
    },
    actions: {
        //用户登录，只获取返回的 token
        login({commit}, loginForm) {
            const {username, password} = loginForm;
            return new Promise((resolve, reject) => {
                api.login({username: username, password: password}).then(res => {
                    setToken(res.data.token);
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //获取当前登录用户的信息--通过token获取用户的相关信息
        getUserInfo: ({commit, state}, userInfo) => {
            return new Promise((resolve, reject) => {
                let token = getToken();
                api.getUserInfo({token}).then(res => {
                    let userInfo = res.data;
                    if (!userInfo) {
                        reject('校验失败，请重新登录')
                    }
                    commit('SET_USERINFO', userInfo);
                    resolve(userInfo)
                }).catch(error => {
                    reject(error)
                })
            });
        },
        //清除用户信息以及其他缓存数据
        clearCurrentState: ({commit}) => {
            commit('SET_USERINFO', null);
            removeToken();
        },
    },
    getters: {}
};

export default user;
