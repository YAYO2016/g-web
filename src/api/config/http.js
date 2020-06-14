import axios from 'axios';
import router from '@/router';
import store from "@/store"
import {Message, Loading} from "element-ui"
import {getToken} from "../../common/js/auth";
import util from "@/common/js/util"
import _ from 'lodash';

let loadingInstance;
let loadingCount = 0;

const BASE_URL = process.env.VUE_APP_API_URL;

//注意，最新版本的axios无法自定义config的属性值，所以建议安装0.18.0的axios，可以自由添加config的属性值
// 创建axios实例
const http = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 请求超时时间

});

function startLoading() {
    if (loadingCount === 0) {

        // 开始加载
        loadingInstance = Loading.service({
            lock: true,
            text: '数据加载中，请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });

    }
    loadingCount++;

}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
const toHideLoading = _.debounce(() => {
    if (loadingCount <= 0) {
        loadingInstance.close();
        //loadingInstance = null;
    }
}, 300);

function endLoading() {
    if (loadingCount <= 0) return;
    loadingCount--;
    if (loadingCount === 0) {
        // 结束加载
        toHideLoading();
    }
}

// 添加request拦截器--请求拦截
http.interceptors.request.use(config => {
    if (config.options.loading) {
        startLoading();
    }

    //请求拦截器中给所有的请求header中添加token
    if (util.TypeFn.isTrue(getToken())) {
        //将cookie中的token添加到header中的Authorization，后台根据Authorization去获取请求中返回的token
        config.headers['Authorization'] = `${getToken()}`;
    }

    if (config.headers['Content-Type'] === 'application/json;charset=UTF-8') {
        if (config.method === 'post') {
            config.data = {
                ...config.data,
                _t: Date.parse(new Date()) / 1000,
            }
        } else if (config.method === 'get') {
            config.params = {
                _t: Date.parse(new Date()) / 1000,
                ...config.params
            }
        }
    }
    return config
}, error => {

    //store.dispatch('common/set_loading', false);
    loadingCount = 0;
    endLoading();

    Promise.reject(error)
});
// 添加respone拦截器--拦截响应
http.interceptors.response.use(
    response => {
        if (response.config.options.loading) {
            endLoading();
        }

        if (response.status == 200) {  //http请求OK
            if (response.data.code == 200) {  //业务code OK
                return Promise.resolve(response.data) //直接返回data字段中的数据
            } else {
                Message.error(response.data.message || "请求失败");
                return Promise.reject(response)
            }
        } else {
            Message.error(response.data.message || "请求失败");
            return Promise.reject(response)
        }
    },
    error => {
        //store.dispatch('common/set_loading', false);
        loadingCount = 0;
        endLoading()

        let errorMessage = error.message;

        if (error.response) {
            console.log(error.response.status);
            switch (error.response.status) {
                case 401:
                    console.log(401);
                    store.dispatch("user/clearCurrentState");
                    router.push({path: '/login'});
                    errorMessage = "token值无效，请重新登录";
                    break;
                case 403:
                    console.log(403);
                    break;
                case 404:
                    console.log(404);
                    break;
                case 500:
                    console.log(500);
                    break;
                default:
                    errorMessage = "请求失败";
                    break;
            }
        }
        Message.error(errorMessage);
        return Promise.reject(error.response)
    }
);

function get(url, params = {}, options = {}) {
    return http({
        url,
        method: 'GET',
        headers: {
            //'Authorization': localStorage.getItem('token')
        },
        params,
        options
    })
}

//封装post请求
function post(url, data = {}, options = {}) {
    return http({
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
        options
    })
}


export default {
    get, post
};
