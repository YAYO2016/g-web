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
//修改elementUI的默认样式
// import './element-var.scss';
Vue.use(ElementUI);
//设置elementUI的全局size
Vue.prototype.$ELEMENT = {size: 'mini'};

//导入babel-polyfill，解决ie9和一些低版本的高级浏览器对es6新语法并不支持
import "babel-polyfill";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
