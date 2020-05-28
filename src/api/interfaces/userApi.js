/**
 * Created by yanyue on 2019-09-18 17:10
 * 用户相关的接口请求
 */
import Http from '@/api/config/http.js';

const post = Http.post;
const get = Http.get;
const upload = Http.upload;

const userApi = {
    //注册接口
    register(params) {
        return post('/user/register', params)
    },
    login(params) {
        return post('/user/login', params)
    },
    forgetPassword(params) {
        return post('/user/forgetPassword', params)
    },
    getUserInfo(params) {
        return post('/user/getUserInfo', params)
    },
    getAllUsers(params) {
        return post('/user/getAllUsers', params)
    },
    getSingleUser(params) {
        return post('/user/getSingleUser', params)
    },
    avatarUpload(params) {
        return upload('/file/uploadfile', params)
    },
    editUser(params) {
        return post('/user/editUser', params, {loading: true})
    },

};

export default userApi;
