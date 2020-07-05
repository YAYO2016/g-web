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
    },
    //删除分类
    deleteCategory(params) {
        return post('/info/deleteCategory', params, {loading: true})
    },

    //新增和编辑信息
    addOrEditInfo(params) {
        return post('/info/addOrEditInfo', params, {loading: true})
    },
    //获取所有的信息
    getAllInfo(params) {
        return post('/info/getAllInfo', params, {loading: true})
    },
    //删除信息
    deleteInfo(params){
        return post('/info/deleteInfo', params, {loading: true})
    }
};

export default infoApi;
