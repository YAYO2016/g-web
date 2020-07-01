import axios from 'axios';
import router from '@/router';
import store from "@/store"
import {Message, Loading} from "element-ui"
import {getToken} from "../../common/js/auth";
import util from "@/common/js/util"
import _ from 'lodash';
import JSZip from 'jszip'
import FileSaver from 'file-saver'

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
            background: 'rgba(0, 0, 0, 0.7)',
            target:document.querySelector("#content-main")
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

// 添加request拦截器--请求拦截（请求接口触发前，做一些处理）
http.interceptors.request.use(config => {
    if (config.options.loading) {
        startLoading();
    }

    //请求拦截器中给所有的请求header中添加token
    if (util.TypeFn.isTrue(getToken())) {
        //将cookie中的token添加到header中的Authorization，后台根据Authorization去获取请求中返回的token
        config.headers['Authorization'] = `${getToken()}`;
    }

    //if (config.headers['Content-Type'] === 'application/json;charset=UTF-8') {
    //    if (config.method === 'post') {
    //        config.data = {
    //            ...config.data,
    //            _t: Date.parse(new Date()) / 1000,
    //        }
    //    } else if (config.method === 'get') {
    //        config.params = {
    //            _t: Date.parse(new Date()) / 1000,
    //            ...config.params
    //        }
    //    }
    //}

    // get请求因为存在缓存，需要价格时间戳参数解决缓存问题
    if (config.method === 'get') {
        config.params = {
            _t: Date.parse(new Date()) / 1000,
            ...config.params
        }
    }

    //获得请求头
    //console.log(config.headers);

    return config
}, error => {

    //store.dispatch('common/set_loading', false);
    loadingCount = 0;
    endLoading();

    return Promise.reject(error)
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
            } else if (response.config.responseType === "blob" && response.data.code === undefined) {  //文件下载
                //如果是下载接口的话，返回的是bolob二进制数据，没有业务code，直接下载，返回接口返回的二进制码
                // 获取文件名  后台接口需要返回  -- ctx.set('Content-disposition', 'attachment;filename=' + filename);
                // 文件名如果是中文的话  需要进行解码
                let filename = decodeURI(response.headers['content-disposition'].split(";")[1].split("filename=")[1]);
                // 创建连接进行文件的下载
                let oA = document.createElement('a');
                oA.href = window.URL.createObjectURL(new Blob([response.data], {type: 'application/octet-stream'}));
                oA.download = filename;
                // 模拟点击
                oA.click();
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
        endLoading();

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

//封装get请求
export function get(url, params = {}, options = {}) {
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
export function post(url, data = {}, options = {}) {
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

//上传文件
export function upload(url, data = {}, options = {}, callback = () => {
}) {
    return http({
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data,
        options,
        //文件上传显示进度条
        onUploadProgress(processEvent) {
            if (processEvent.lengthComputable) {
                callback(parseInt((processEvent.loaded / processEvent.total * 100).toFixed(0)));
            }
        },
    })
}


//普通下载文件
export function download(url, params = {}, options = {}, callback = () => {
}) {
    return http({
        url,
        method: 'GET',
        headers: {
            //'Content-Type': 'multipart/form-data'，
        },
        responseType: 'blob',
        params,
        options,
        //文件下载显示进度条
        onDownloadProgress(processEvent) {
            //processEvent.lengthComputable 所关联的资源是否具有可以计算的长度;否则 ，ProgressEvent.total 属性将是一个无意义的值,
            //需要后台发送的时候带有文件的大小数据  Content-Length
            if (processEvent.lengthComputable) {
                console.log(parseInt((processEvent.loaded / processEvent.total * 100)));
                callback(parseInt((processEvent.loaded / processEvent.total * 100).toFixed(0)));
            }
        },
    })
}

/**
 * 批量下载文件并且打包成zip包
 * 本质上还是单独下载文件，只不过将单独下载的文件进行打包，然后输出成一个zip
 * 需要 npm i jszip file-saver -S 工具包
 * @param url
 * @param fileList
 * @param zipName
 * @returns {Promise<void>}
 */
export const downloadBatch = async (url, fileList, zipName) => {
    //console.log(fileList);
    const zip = new JSZip();
    const cache = {};
    const promises = [];
    await fileList.forEach(item => {
        //下载单个文件
        const promise = download(url, item).then(res => { // 下载文件, 并存成ArrayBuffer对象
            let file_name = item.name; // 获取文件名
            // if (file_name.indexOf('.png') == -1) {
            //    file_name = file_name + '.png'
            // }
            zip.file(file_name, res, {
                binary: true
            }); // 逐个添加文件
            cache[file_name] = res
        }).catch(err => {
            Message.error("文件下载失败");
        });
        promises.push(promise)
    });
    //所有文件都下载完成，进行打包zip输出
    Promise.all(promises).then(() => {
        zip.generateAsync({
            type: "blob"
        }).then(content => { // 生成二进制流
            FileSaver.saveAs(content, zipName) // 利用file-saver保存文件
        }).catch(err => {
            Message.error("文件下载失败");
        })
    })

};


//export default {
//    get, post
//};
