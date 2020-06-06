/**
 * Created by yanyue on 2019-09-18 17:10
 * 用户相关的接口请求
 */
import Http from '@/api/config/http.js';

const upload = Http.upload;

const uploadFileApi = {
    uploadFile(params, callback) {
        return upload('/file/uploadfile', params, {}, callback)
    },
};

export default uploadFileApi;
