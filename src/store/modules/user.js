/**
 * Created by yanyue on 2020/5/27 20:03
 */
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
        set_userInfo({commit}, data) {
            commit('SET_USERINFO', data);
        }
    },
    getters: {}
};

export default user;
