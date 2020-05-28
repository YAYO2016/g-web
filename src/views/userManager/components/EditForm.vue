<template>
    <div class='EditForm'>
        <el-form ref="formData" :model="formData" label-width="100px">
            <el-form-item label="用户名：" class="fl">
                <el-input v-model="formData.username" style="width: 175px" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" class="fl">
                <el-input v-model="formData.email" style="width: 175px" disabled></el-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="头像：" class="upload">
                <el-upload
                        class="avatar-uploader"
                        action=""
                        :multiple="false"
                        :auto-upload="true"
                        :before-upload="(file)=>beforeUpload(file,fileList)"
                        :http-request="httpRequest"
                        :show-file-list="false">
                    <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="用户角色：">
                <el-select v-model="formData.roles" placeholder="请选择角色" multiple>
                    <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/28 16:21
     */
    import axios from "axios"

    export default {
        name: "EditForm",
        props: {
            formData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        computed: {},
        data() {
            return {
                imageUrl: "",
                roleOptions: [
                    {label: "管理员", value: "admin"},
                    {label: "游客", value: "visitor"}
                ],
                fileMaxSize: 50,
                fileList: []
            }
        },
        methods: {
            beforeUpload(file, fileList) {
                let vm = this;
                const isLtMax = file.size / 1024 / 1024 < vm.fileMaxSize;
                const regexFlag = /(^((?![\\/:*?“<>|`!@#$%&()]).)*$)/.test(file.name);
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
                vm.$api.avatarUpload(formData).then(res => {
                    vm.formData.avatar = vm.iobsUrl + res.data.name;
                    vm.$forceUpdate();
                    vm.$message.success("上传成功");
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .EditForm {

    }
</style>
