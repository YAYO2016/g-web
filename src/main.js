import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

//导入normalize.css：Normalize的作用就是统一浏览器的初始样式
//import 'normalize.css'
import "@/common/style/reset.css"

//安装使用elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from "element-ui/lib/locale/lang/en";
//修改elementUI的默认样式
//import './element-var.scss';

Vue.use(ElementUI, {size: 'small', locale});
//设置elementUI的全局size
//Vue.prototype.$ELEMENT = {size: 'mini'};

// 国际化
import i18n from "@/i18n";

//svg的icon导入
import '@/icons'

//导入自定义校验数据
import rules from './common/js/rules';
Vue.prototype.$rules = rules;

//全局使用自定义的UI的组件
import GUI from './components/plugins';
Vue.use(GUI);

//导入font-awesome，font-awesome图标
import 'font-awesome/css/font-awesome.min.css'

//导入api接口
import api from './api/index';
Vue.prototype.$api = api;

//导入bus总线
import bus from './common/js/bus.js';
Vue.prototype.$bus = bus;

//在全局注册一些自定义方法
import globalFun from './common/js/global-fun';
Vue.use(globalFun);

//导入vue的自定义指令
import "@/common/js/directive";

//导入babel-polyfill，解决ie9和一些低版本的高级浏览器对es6新语法并不支持
import "babel-polyfill";

//js的计算库，可以避免精度丢失
import { create, all } from 'mathjs';
const mathjs = create(all);
mathjs.config({
    number: 'BigNumber',
    // 'number' (default),
    precision: 20
    //BigNumbers的最大有效位数
});
Vue.prototype.$mathjs = mathjs;

// runtime模式 （运行时模式）
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
