<template>
    <div class='GUploadFile'>
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
            <ul>
                <li v-for="(item,index) in fileList" :key="index">
                    <div>
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
                            <el-button>下载</el-button>
                            <el-button>删除</el-button>
                        </span>
                        <span v-if="item.progress===100" class="finish-time" style="float: right">
                            上传完成 上传于{{new Date(item.uploadTime).format("yyyy-MM-dd hh:mm:ss")}}
                        </span>
                        <span v-else class="finish-time" style="float: right">
                            上传中......
                        </span>
                    </div>
                </li>
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
                    <div slot="tip" class="el-upload__tip">{{fileUploadText}}}，且不超过{{fileMaxSize}}M</div>
                </el-upload>
            </ul>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2019-12-25 17:30
     */

    export default {
        name: "GUploadFile",
        data() {
            return {}
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
                if (!isLtMax) {
                    vm.$messgae.error(`上传文件不能超过${vm.fileMaxSize}MB`)
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
        }

    }
</script>

<style lang='scss' scoped>
    .GUploadFile {
        display: inline-block;
        width: 750px;

        li {
            margin-bottom: 5px;
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
