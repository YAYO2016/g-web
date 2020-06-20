/**
 * Created by yanyue on 2019-09-18 17:10
 * 上传下载文件相关的接口
 */
import {upload, download, downloadBatch} from '@/api/config/http.js';
import HttpDownload from '@/api/config/httpDownload.js';

//const download = HttpDownload.download;
//const downloadBatch = HttpDownload.downloadBatch;

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
        return downloadBatch("/file/downloadFile", params, zipName)
    },
};

export default uploadFileApi;
