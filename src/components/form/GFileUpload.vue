<template>
    <div class='GFileUpload'>
        <el-upload
                :class="{hide:hideUpload}"
                list-type="picture-card"
                class="upload-demo"
                :multiple="false"
                action=""
                :auto-upload="true"
                :on-change="handleChange"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :http-request="httpRequest"
                :file-list="fileList"
                :disabled="disabled"
                :limit="limit"
        >
            <!-- 使用fileList来回显图片 -->
            <!--<img v-if="editInfoForm.thumbPic" :src="iobsUrl+editInfoForm.thumbPic" class="avatar">-->
            <i class="el-icon-plus"></i>
        </el-upload>
        <!--打开缩略图模版
        :modal-append-to-body='false' 必须加
        -->
        <el-dialog class="upload-detail-img" :visible.sync="dialogVisible" :modal-append-to-body='false'>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/7/10 12:45
     * 上传文件的自定义组件
     */

    export default {
        name: "GFileUpload",
        props: {
            fileList: {
                type: Array,
                default: () => ([])
            },
            beforeUpload: {  //上传文件前执行的函数
                type: Function,
                default: () => {
                }
            },
            httpRequest: {   //上传文件函数
                type: Function,
                default: () => {
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            limit: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                viewFileList: [],
                dialogVisible: false,  //显示大图dialog
                dialogImageUrl: ''  //dialog大图的图片地址
            }
        },
        computed: {
            hideUpload() {
                return this.viewFileList.length >= this.limit;
            }
        },
        mounted() {
            this.viewFileList = this.fileList;
        },
        methods: {
            handleChange(file, fileList) {
                this.viewFileList = fileList;
                //this.hideUpload = fileList.length >= this.limit;
            },
            handleRemove(file, fileList) {
                this.viewFileList = fileList;
                //this.hideUpload = fileList.length >= this.limit;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;   //这边使用了url，那么fileList中的对象的图片地键名就是url
                this.dialogVisible = true;
            },
            isTrue(o) {  //是否是true
                return !this.isFalse(o)
            },
            isFalse(o) {  //是否是false
                if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true;
                return false
            },
        },
        watch: {
            fileList(newVal) {
                this.viewFileList = newVal;
            },
            viewFileList(newVal) {
                if (this.isTrue(newVal)) {
                    this.$emit("update:fileList", newVal);
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .GFileUpload {
        //el-upload上传图标的大小
        /deep/ .el-upload--picture-card {
            width: 65px;
            height: 65px;
            line-height: 65px;

            i {
                //z-index: 99;
                font-size: 20px;
            }
        }

        /deep/  .el-upload-list--picture-card {
            .el-upload-list__item-status-label {
                right: -7px;
                top: -3px;
                width: 20px;
                height: 12px;

                i {
                    font-size: 6px;
                    top: 2px;
                    right: 6px;
                    position: absolute;
                    margin-top: 0;
                }
            }

            li {
                width: 65px !important;
                height: 65px !important;
                line-height: 65px !important;
            }

        }

        // 上传图片后不显示上传的按钮了
        .hide /deep/ .el-upload--picture-card {
            display: none !important;
        }

        /*模态框查看图片*/
        .upload-detail-img {
            text-align: center;

            img {
                max-width: 100%;
                width: auto;
                max-height: 500px;
                height: auto;
            }
        }
    }


</style>
