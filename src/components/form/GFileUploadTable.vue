<template>
    <div class='GFileUploadTable'>
        <div v-if="fileList.length === 0">
            <el-upload
                    class="upload-demo"
                    action=""
                    :multiple="multiple"
                    :limit="limit"
                    :auto-upload="true"
                    :accept="acceptType"
                    :before-upload="(file)=>beforeUpload(file,fileList)"
                    :http-request="httpRequest"
                    :show-file-list="false"
                    :disabled="disabled"
                    :data="{fileList}">
                <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">{{fileUploadText}}}，且不超过{{fileMaxSize}}M</div>
            </el-upload>
        </div>
        <div v-else>
            <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="(item,index) in fileList" :key="index" :label="item">
                    <!--label 就是会选中时候放置到checkList值-->
                    <div class="li">
                        <span class="num">{{index+1}}.</span>
                        <span class="file-name" :title="item.fileName">{{item.fileName}}</span>
                        <span class="progress">
                            <el-progress
                                    v-if="item.progress"
                                    :percentage="item.progress"
                                    style="width: 200px;display: inline-block"
                            >
                            </el-progress>
                        </span>
                        <span class="buttons" style="margin-left: 10px;float: right">
                            <el-button @click="downloadFile(item)" :loading="item.loading">下载
                                {{item.downloadProgress&&item.downloadProgress!=0&&item.downloadProgress!=100?item.downloadProgress:''}}
                            </el-button>
                            <el-button>删除</el-button>
                        </span>
                        <span v-if="item.progress===100" class="finish-time" style="float: right">
                            上传完成 上传于{{new Date(item.uploadTime).format("yyyy-MM-dd hh:mm:ss")}}
                        </span>
                        <span v-else class="finish-time" style="float: right">
                            上传中......
                        </span>
                    </div>
                </el-checkbox>
                <el-upload
                        class="uploaded-demo"
                        action=""
                        :auto-upload="true"
                        :multiple="multiple"
                        :limit="limit"
                        :accept="acceptType"
                        :before-upload="(file)=>beforeUpload(file,fileList)"
                        :http-request="httpRequest"
                        :show-file-list="false"
                        :disabled="disabled"
                        :data="{fileList}">
                    <el-button type="primary" icon="el-icon-upload2">继续添加</el-button>
                    <el-button type="primary" @click.stop="downloadBatch">
                        <svg-icon icon-class="zip"></svg-icon>
                        批量下载
                    </el-button>
                    <div slot="tip" class="el-upload__tip">{{fileUploadText}}}，且不超过{{fileMaxSize}}M</div>
                </el-upload>

            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2019-12-25 17:30
     */

    export default {
        name: "GFileUploadTable",
        data() {
            return {
                checkList: []
            }
        },
        props: {
            fileList: {
                type: Array,
                default: []
            },
            acceptType: {
                type: String,
                default: "*"
            },
            fileMaxSize: {
                type: Number,
                default: 500
            },
            fileUploadText: {
                type: String,
                default: "支持PDF\\HRML\\WORD\\EXCEL等格式"
            },
            //是否允许上传多个文件
            multiple: {
                type: Boolean,
                default: false
            },
            //上传文件数量限制
            limit: {
                type: Number,
                default: 999
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            beforeUpload(file, fileList) {
                let vm = this;
                const isLtMax = file.size / 1024 / 1024 < vm.fileMaxSize;
                const regexFlag = /(^((?![\\/:*?“<>|`!@#$%&()]).)*$)/.test(file.name);
                const isJPG = file.type === 'image/jpeg';
                if (!isLtMax) {
                    vm.$messgae.error(`上传文件不能超过${vm.fileMaxSize}MB`);
                    return;
                }
                if (!regexFlag) {
                    vm.$messgae.error("附件名称不能包含特殊字符");
                    return;
                }
                if (isLtMax && regexFlag) {
                    fileList.push({...file})
                }
                return isLtMax && regexFlag;
            },
            httpRequest(e) {
                let vm = this;
                let file = e.file;
                let formData = new FormData();
                formData.append("file", file);
                let index = e.data.fileList.length - 1;
                e.data.fileList[index].fileName = file.name;
                vm.$api.uploadFile(formData, (progress) => {
                    vm.showProgress(file, progress, e.data.fileList);
                }).then(res => {
                    e.data.fileList[index] = {...res.data, progress: 100};
                    vm.$forceUpdate();
                })
            },
            //设置当前文件上传过程中的百分比，用来显示进度条
            showProgress(file, progress, fileList) {
                let vm = this;
                vm.$set(fileList.filter(_file => _file.uid === file.uid)[0], "progress", progress);
            },
            //下载文件（单个文件的下载）
            downloadFile(item) {
                let vm = this;
                vm.$set(item, 'loading', true);
                vm.$api.downloadFile({filename: item.name, originName: encodeURI(item.fileName)}, (downloadProgress => {
                    //console.log(downloadProgress);
                    //vm.showDownloadProgress(file, downloadProgress, vm.fileList);
                })).then(res => {
                    //将接口返回的二进制文件流 进行封装下载成文件
                    // 创建一个a标签
                    //let oA = document.createElement('a');
                    //oA.href = window.URL.createObjectURL(new Blob([res], {type: 'application/octet-stream'}));
                    //// 给文件命名
                    ////这里之所以将下载文件的逻辑没有写到http.js中是因为需要这边发出请求时候的文件名 item.fileName;
                    //oA.download = item.fileName;
                    //// 模拟点击
                    //oA.click();
                    vm.$set(item, 'loading', false);
                })
            },
            showDownloadProgress(file, downloadProgress, fileList) {
                let vm = this;
                vm.$set(fileList.filter(_file => _file.uid === file.uid)[0], "downloadProgress", downloadProgress);
            },
            //文件批量下载（多个文件打包zip下载）
            //downloadBatch() {
            //    let vm = this;
            //    vm.$api.downloadBatch([
            //        {filename: "2C5140AB28C21C4D.jpg", name: "yanyue.jpg"},
            //        {filename: "43D6D4047C66FEC2.jpeg", name: "avatar.jpg"},
            //        {filename: "58D60C09F72C5CDC.docx", name: "0.前端.docx"}
            //    ], "file.zip")
            //}
            downloadBatch() {
                let vm = this;
                if (vm.checkList.length > 0) {
                    let downFileList = vm.checkList.map(file => {
                        return {name: file.fileName, filename: file.name}
                    });
                    vm.$api.downloadBatchApi(downFileList, "file.zip")
                } else {
                    vm.$message("请先选中文件！")
                }

            }
        }

    }
</script>

<style lang='scss' scoped>
    .GFileUploadTable {
        display: inline-block;
        width: 750px;

        .li {
            margin-bottom: 5px;
            height: 25px;
            line-height: 25px;
        }

        .file-name {
            display: inline-block;
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: bottom;
        }

        .progress {
            margin-left: 10px;
        }

        .el-progress {
            width: 100px !important;
        }

        .el-process-bar {
            width: 100%;
            height: 10px;
        }

        .el-process__text {
            color: #799Cff;
            font-size: 12px;
        }

        .ep-progress-bar__outer {
            border-radius: 0;
            height: 10px;
            width: 50px;
            border: 1px solid #799cff;
        }

        .el-progress-bar__inner {
            border-radius: 0;
        }

        .finish-time {
            color: #777;
        }

    }
</style>
