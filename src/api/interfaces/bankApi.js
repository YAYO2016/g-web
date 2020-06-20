/**
 * Created by yanyue on 2019-09-18 17:10
 * 用户相关的接口请求
 */
import {get, post} from '@/api/config/http.js';

//const post = Http.post;
//const get = Http.get;

const bankApi = {
    //获取银行列表
    getBanks(params) {
        return post('/bank/getBanks', params, {loading: true})
    },

    //获取用户信息
    getBankInfo(params) {
        return post('/bank/getBankInfo', params)
    },

};

export default bankApi;
