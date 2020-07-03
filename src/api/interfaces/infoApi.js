/**
 * Created by yanyue on 2020/7/1 21:51
 * 信息接口
 */
import {get, post} from '@/api/config/http.js';

const infoApi = {
    //获取所有分类信息
    getAllCategory() {
        return get('/info/getAllCategory', {loading: true})
    },
    //添加分类
    infoAddCategory(params) {
        return post('/info/addCategory', params, {loading: true})
    }

};

export default infoApi;
