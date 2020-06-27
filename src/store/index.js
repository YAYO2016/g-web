import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createLogger from 'vuex/dist/logger';
//实现vuex的数据持久化  默认是放置在localStorage中的
import createPersistedState from 'vuex-persistedstate';

//导入模块
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules
}, {});

const createPersisted = createPersistedState({
    //如果想放置搭配sessionStorage中，如下配置，session在浏览器关闭之后就消失，比较适合
    storage: window.sessionStorage,
    reducer(state) {
        return {
            // 只储存state中的common模块
            common: state.common
            //如果只想存储state的common模块中的某一个变量isCollapse，就这样写
            //common: {
            //    isCollapse: state.common.isCollapse
            //}
        }
    }
});


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
    getters,
    modules,
    strict: false, //是否可以不通过mutations去修改state数据 //strict
    plugins: debug ? [createLogger(), createPersisted] : [createPersistedState()],
    //plugins: debug ? [createLogger()] : [],
})
