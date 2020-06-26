/**
 * Created by yanyue on 2020/3/15 21:38
 */
import util from '../../common/js/util'

const common = {
    namespaced: true,
    state: {
        isCollapse: false,
        tabsList: initTabs(),
    },
    mutations: {
        SET_COLLAPSE(state, payload) {
            state.isCollapse = payload;
        },
        SET_TABSLIST(state, payload) {
            state.tabsList = payload;
        },
    },
    actions: {
        //注意 获取数据可以通过state获取，但是直接修改state数据，
        // 不通过mutations的话，vuex中的数据不及时生效的
        collapseMenu: ({commit, state}) => {
            commit('SET_COLLAPSE', !state.isCollapse);
        },
        //getTabs: ({commit, state}) => {
        //    if (util.StorageFn.getLocal("tabsList")) {
        //        commit('SET_TABSLIST', util.StorageFn.getLocal("tabsList"));
        //    }
        //},
        //关闭一个tab
        closeTab: ({commit, state}, payload) => {
            //let result = (state.tabsList || util.StorageFn.getLocal("tabsList")).findIndex(item => item.name === payload.name);
            let result = state.tabsList.findIndex(item => item.name === payload.name);
            let tabsList = [...state.tabsList];
            tabsList.splice(result, 1);
            commit('SET_TABSLIST', tabsList);
            //util.StorageFn.setLocal("tabsList", tabsList);
        },
        //点击菜单会新增没有加过的tab
        selectMenu: ({commit, state}, payload) => {
            //console.log(payload);
            //tabList中不存在的话就新增下
            //let result = (state.tabsList || JSON.parse(localStorage.tabsList) || []).findIndex(item => item.name === payload.name);
            let result = (state.tabsList || []).findIndex(item => item.name === payload.name);
            if (result === -1) {
                let tabsList = [...state.tabsList];
                tabsList.push(payload);
                commit('SET_TABSLIST', tabsList);
                //util.StorageFn.setLocal("tabsList", tabsList);
            }
        },
        //清空tabs
        clearTabs: ({commit, state}, payload) => {
            commit('SET_TABSLIST', initTabs());
            //util.StorageFn.removeLocal("tabsList");
        }
    },
    getters: {}
};


function initTabs() {
    return [
        {
            path: '/home',
            name: 'Home',
            meta: {title: '首页', icon: 'el-icon-s-home'}
        }
    ]
}


export default common;
