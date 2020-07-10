<template>
    <div class='InfoDetail'>
        <!-- 信息详情 -->
        <el-form ref="editInfoForm" :model="editInfoForm" label-width="80px">
            <el-form-item label="类别" prop="category" :rules="$rules.NotEmpty">
                <!-- 技术点：这边的数据传递的是option对象，并不是option中的id -->
                <g-select :value.sync="editInfoForm.category" :options="$store.state.info.categoryList"
                          option-key="infoCategoryName"
                          option-value="infoCategoryId"
                          :returnItem="true"
                >
                </g-select>
            </el-form-item>
            <el-form-item label="标题" prop="title" :rules="$rules.NotEmpty">
                <el-input v-model="editInfoForm.title"></el-input>
            </el-form-item>
            <el-form-item label="缩略图" prop="thumbPic" :rules="[{...$rules.NotEmpty[0],message:'上传图片不能为空'}]">
                <el-input v-show="false" v-model="editInfoForm.thumbPic"></el-input>
                <!-- 缩略图进行封装 -->
                <g-file-upload :fileList.sync="editInfoForm.thumbPicList"
                               :limit="1"
                               :beforeUpload="beforeUpload"
                               :httpRequest="httpRequest"
                ></g-file-upload>

                <!--<el-upload-->
                <!--:class="{hide:hideUpload}"-->
                <!--list-type="picture-card"-->
                <!--class="upload-demo"-->
                <!--:multiple="false"-->
                <!--:limit="1"-->
                <!--action=""-->
                <!--:auto-upload="true"-->
                <!--:on-change="handleChange"-->
                <!--:on-preview="handlePictureCardPreview"-->
                <!--:on-remove="handleRemove"-->
                <!--:before-upload="beforeUpload"-->
                <!--:http-request="httpRequest"-->
                <!--:file-list="fileList"-->
                <!--&gt;-->
                <!--&lt;!&ndash; 使用fileList来回显图片 &ndash;&gt;-->
                <!--&lt;!&ndash;<img v-if="editInfoForm.thumbPic" :src="iobsUrl+editInfoForm.thumbPic" class="avatar">&ndash;&gt;-->
                <!--<i class="el-icon-plus"></i>-->
                <!--</el-upload>-->
                <!--&lt;!&ndash;打开缩略图模版-->
                <!--:modal-append-to-body='false' 必须加-->
                <!--&ndash;&gt;-->
                <!--<el-dialog class="upload-detail-img" :visible.sync="thumbPicVisible" :modal-append-to-body='false'>-->
                <!--<img width="100%" :src="editInfoForm.thumbPic" alt="">-->
                <!--</el-dialog>-->

            </el-form-item>
            <el-form-item label="发布时间" prop="content" :rules="$rules.NotEmpty">
                <el-date-picker type="datetime" v-model="editInfoForm.createDate" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="详细内容" prop="content" :rules="$rules.NotEmpty">
                <!--<el-input type="textarea" v-model="editInfoForm.content"></el-input>-->
                <quillEditor v-model="editInfoForm.content"
                             ref="quillEditor"
                             :options="editorOptions">
                </quillEditor>
            </el-form-item>
            <el-form-item>
                <el-button @click="$router.push('/info/infoList')">取消</el-button>
                <el-button type="primary" @click="editInfoSure('editInfoForm')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/7/5 20:15
     */

    //导入富文本编辑器的包
    import {quillEditor} from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    // 不需要的的选项在这里删掉就好
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
        ['blockquote', 'code-block'],     //引用，代码块

        [{'header': 1}, {'header': 2}],        // 标题，键值对的形式；1、2表示字体大小
        [{'list': 'ordered'}, {'list': 'bullet'}],     //列表
        [{'script': 'sub'}, {'script': 'super'}],   // 上下标
        [{'indent': '-1'}, {'indent': '+1'}],     // 缩进
        [{'direction': 'rtl'}],             // 文本方向

        [{'size': ['small', false, 'large', 'huge']}], // 字体大小
        [{'header': [1, 2, 3, 4, 5, 6, false]}],     //几级标题

        [{'color': []}, {'background': []}],     // 字体颜色，字体背景颜色
        [{'font': []}],     //字体
        [{'align': []}],    //对齐方式

        ['clean'],    //清除字体样式
        ['image', 'video']    //上传图片、上传视频
    ];

    export default {
        name: "InfoDetail",
        components: {quillEditor},
        data() {
            return {
                infoId: "",
                editInfoForm: this.initEditForm(),
                // editorOption里是放图片上传配置参数用的，例如：
                // action:  '/api/product/richtext_img_upload.do',  // 必填参数 图片上传地址
                // methods: 'post',  // 必填参数 图片上传方式
                // token: '',  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
                // name: 'upload_file',  // 必填参数 文件的参数名
                // size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
                // accept: 'multipart/form-data, image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg'  // 可选 可上传的图片格式
                editorOptions: {
                    modules: {
                        toolbar: {
                            container: toolbarOptions, // 工具栏
                        },
                    },
                    placeholder: '请输入正文...'
                },
                hideUpload: false,
                thumbPicVisible: false,
                fileList: [], //回显图片使用
            }
        },
        created() {
            let vm = this;
            //获取路由参数中返回的infoId
            vm.infoId = vm.$route.query.infoId;
            //接口获取该信息的具体数据
            vm.$api.getAllInfo({infoId: vm.infoId}).then(res => {
                vm.editInfoForm = {...vm.editInfoForm, ...JSON.parse(JSON.stringify(res.data.list[0]))};
                vm.editInfoForm.category = {
                    infoCategoryName: vm.editInfoForm.infoCategoryName,
                    infoCategoryId: vm.editInfoForm.infoCategoryId
                };
                if (vm.editInfoForm.thumbPic) {
                    let obj = new Object();
                    obj.url = vm.iobsUrl + vm.editInfoForm.thumbPic;
                    vm.fileList.push(obj);
                    vm.editInfoForm.thumbPicList.push(obj);
                    vm.hideUpload = vm.fileList.length >= 1;
                }

            })
        },
        methods: {
            initEditForm() {
                return {
                    category: "",
                    title: "",
                    content: "",
                    createDate: "",
                    thumbPic: '',
                    thumbPicList: []
                }
            },
            handleChange(file, fileList) {
                let vm = this;
                vm.hideUpload = fileList.length >= 1;
            },
            handleRemove(file, fileList) {
                let vm = this;
                vm.hideUpload = fileList.length >= 1;
            },
            handlePictureCardPreview(file) {
                let vm = this;
                vm.editInfoForm.thumbPic = file.url;
                vm.thumbPicVisible = true;
            },
            beforeUpload(file, fileList) {
                let vm = this;
                //const isLtMax = file.size / 1024 / 1024 < vm.fileMaxSize;
                //const regexFlag = /(^((?![\\/:*?“<>|`!@#$%&()]).)*$)/.test(file.name);
                //if (!isLtMax) {
                //    vm.$messgae.error(`上传文件不能超过${vm.fileMaxSize}MB`);
                //    return;
                //}
                //if (!regexFlag) {
                //    vm.$messgae.error("附件名称不能包含特殊字符");
                //    return;
                //}
                //if (isLtMax && regexFlag) {
                //    fileList.push({...file})
                //}
                //return isLtMax && regexFlag;
                return true
            },
            httpRequest(e) {
                let vm = this;
                let file = e.file;
                let formData = new FormData();
                formData.append("file", file);
                vm.$api.avatarUpload(formData).then(res => {
                    vm.editInfoForm.thumbPic = res.data.name;
                    vm.$forceUpdate();
                    vm.$message.success("上传成功");
                })
            },
            //编辑确认按钮
            editInfoSure(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    vm.$api.addOrEditInfo({
                        infoId: vm.editInfoForm.infoId,
                        title: vm.editInfoForm.title,
                        content: vm.editInfoForm.content,
                        thumbPic: vm.editInfoForm.thumbPic,
                        infoCategoryName: vm.editInfoForm.category.infoCategoryName,
                        infoCategoryId: vm.editInfoForm.category.infoCategoryId,
                    }).then(res => {
                        vm.$message.success("编辑信息成功");
                        vm.$router.push('/info/infoList')
                    })
                }
            },
        }
    }
</script>

<style lang='scss' scoped>
    .InfoDetail {
        @include content-box;

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
