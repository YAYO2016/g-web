/**
 * Created by yanyue on 2019-09-18 17:10
 * 用户相关的接口请求
 */
import Http from '@/api/config/http.js';
import HttpUpload from '@/api/config/httpUpload.js';
import HttpDownload from '@/api/config/httpDownload.js';

const upload = HttpUpload.upload;
const download = HttpDownload.download;
const downloadBatch = HttpDownload.downloadBatch;

const uploadFileApi = {
    //上传文件
    uploadFile(params, callback) {
        return upload('/file/uploadfile', params, {}, callback)
    },
    //下载文件
    downloadFile(params, callback) {
        return download("/file/downloadFile", params, {}, callback)
    },
    //批量下载文件
    downloadBatch(params, zipName) {
        return downloadBatch("/file/downloadFile", params,zipName)
    },
};

export default uploadFileApi;
