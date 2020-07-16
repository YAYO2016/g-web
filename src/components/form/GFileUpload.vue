<template>
    <div class='GFileUpload'>
        <el-upload
                ref="upload"
                :class="{hide:hideUpload}"
                list-type="picture-card"
                class="upload-demo"
                :multiple="multiple"
                action=""
                :auto-upload="cropperUse?false:autoUpload"
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

        <!-- 图片裁剪模态框 -->
        <el-dialog :visible.sync="cropperVisible" v-if="cropperVisible" width="800px" :before-close="beforeClose"
                   :modal-append-to-body='false'>
            <Cropper :img-file.sync="cropperFile"
                     ref="vueCropper"
                     :fixedNumber="fixedNumber"
                     @upload="cropperHttpRequest">
            </Cropper>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/7/10 12:45
     * 上传文件的自定义组件
     */
    //图片裁剪组件
    import Cropper from './Cropper';

    export default {
        name: "GFileUpload",
        components: {Cropper},
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
            },
            // 是否允许多个文件上传
            multiple: {
                type: Boolean,
                default: false
            },
            cropperDialogVisible: {
                type: Boolean,
                default: false
            },
            autoUpload: {
                type: Boolean,
                default: true
            },
            // 是否需要图片的裁剪
            cropperUse: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                //hideUpload: false, //是否隐藏上传部分
                viewFileList: [],
                dialogVisible: false,  //显示大图dialog
                dialogImageUrl: '', //dialog大图的图片地址
                cropperVisible: false,  //裁剪模态框
                fixedNumber: [1.5, 1], // 截图框比例  (默认:[1:1])
                cropperFile: null
            }
        },
        computed: {
            // 计算属性 -- 根据文件长度和文件数量显示 来判断是否需要隐藏上传的组件部分 +
            hideUpload() {
                return this.viewFileList.length >= this.limit;
            }
        },
        created() {
            this.viewFileList = this.fileList;
        },
        updated() {
            if (this.$refs.vueCropper) {
                this.$refs.vueCropper.Update()
            }
        },
        methods: {
            handleChange(file, fileList) {
                //this.viewFileList = fileList;
                // 如果需要裁剪图片，打开图片裁剪模态框
                if (this.cropperUse) {
                    this.cropperVisible = true;
                    this.cropperFile = file;
                    //this.viewFileList = fileList;
                    // 这个是上传过程中el-upload回显的图片列表
                    // 这边我想要的是后台接口返回的，所以我要求的是真实的list去覆盖上传过程中默认的图片
                    this.$refs.upload.uploadFiles = this.viewFileList;
                } else {
                    this.viewFileList = fileList;
                }

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
            beforeClose(done) {
                this.cropperFile = null;  //清空裁剪文件数组
                this.cropperVisible = false;
            },
            async cropperHttpRequest(data) {
                let file = await this.httpRequest(data);
                //将裁剪过后生成的文件列表赋值给上传文件中的裁剪列表
                this.viewFileList.push(file);
                this.cropperVisible = false;
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
            viewFileList(newVal, oldVal) {
                if (newVal.length === oldVal.length && newVal.length === 0) {
                    console.log(this.$refs.upload.uploadFiles);
                    this.$refs.upload.uploadFiles = [];
                } else {
                    this.$emit("update:fileList", newVal);
                    this.$refs.upload.uploadFiles = newVal;
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

        /deep/ .el-upload-list--picture-card {
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
