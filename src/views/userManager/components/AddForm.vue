<template>
    <div class='AddForm'>
        <el-form ref="formData" :model="formData" label-width="100px" :validate-on-rule-change="false">
            <el-form-item label="用户名：" class="fl" prop="username" :rules="$rules.NotEmpty">
                <el-input v-model="formData.username" style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" class="fl" prop="email" :rules="$rules.NotEmpty">
                <el-input v-model="formData.email" style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="密码：" class="fl" prop="password" :rules="$rules.NotEmpty">
                <el-input v-model="formData.password" style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" class="fl" prop="repeatPassword" :rules="$rules.NotEmpty">
                <el-input v-model="formData.repeatPassword" style="width: 175px"></el-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="头像：" prop="avatar" class="upload"
                          :rules="[{...$rules.NotEmpty[0],message:'上传图片不能为空'}]"
                          ref="upload">
                <el-upload
                        class="avatar-uploader"
                        action=""
                        :multiple="false"
                        :auto-upload="true"
                        :before-upload="(file)=>beforeUpload(file,fileList)"
                        :http-request="httpRequest"
                        :on-change="$nextTick(()=>$refs.upload.clearValidate())"
                        :show-file-list="false">
                    <img v-if="formData.avatar" :src="iobsUrl+formData.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="用户角色：" prop="roles" :rules="$rules.NotEmpty">
                <g-select :value.sync="formData.roles" placeholder="请选择角色" all-select :options="roleOptions"></g-select>
            </el-form-item>
        </el-form>
        <el-row :gutter="10">
            <el-col :span="24" align="center">
                <el-button type="primary" @click="addSure('formData')">新增</el-button>
                <el-button @click="$emit('update:show',false)">取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/28 16:21
     */

    export default {
        name: "AddForm",
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
                    vm.formData.avatar = res.data.name;
                    vm.$forceUpdate();
                    vm.$message.success("上传成功");
                })
            },
            addSure(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    // 新增用户  调用接口
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .AddForm {

    }
</style>
