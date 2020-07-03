import api from "@/api";
import {setToken} from "@/common/js/auth";

/**
 * Created by yanyue on 2020/7/3 23:22
 */
const info = {
    namespaced: true,
    state: {
        categoryList: []
    },
    mutations: {
        SET_CATEGORYLIST(state, payload) {
            state.categoryList = payload;
        }
    },
    actions: {
        getCategoryList({commit}) {
            return new Promise((resolve, reject) => {
                api.getAllCategory().then(res => {
                    commit('SET_CATEGORYLIST', res.data.list);
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
    getters: {}
};

export default info;
