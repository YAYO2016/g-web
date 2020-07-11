<template>
    <div class='EditForm'>
        <el-form ref="formData" :model="formData" label-width="100px">
            <el-form-item label="用户名：" class="fl" prop="username" :rules="[{...$rules.NotEmpty[0],message:'用户名不能为空'}]">
                <el-input v-model="formData.username" style="width: 175px" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" class="fl" prop="email" :rules="$rules.EmailRule">
                <el-input v-model="formData.email" style="width: 175px" disabled></el-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="头像：" class="upload" prop="avatar" :rules="$rules.NotEmpty">
                <el-input v-show="false" v-model="formData.avatar"/>
                <el-upload
                        class="avatar-uploader"
                        action=""
                        :multiple="false"
                        :auto-upload="true"
                        :before-upload="(file)=>beforeUpload(file,fileList)"
                        :http-request="httpRequest"
                        :show-file-list="false">
                    <img v-if="formData.avatar" :src="iobsUrl+formData.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="用户角色：" prop="roles" :rules="$rules.NotEmpty">
                <!--<el-select v-model="formData.roles" placeholder="请选择角色" multiple>-->
                <!--<el-option-->
                <!--v-for="item in roleOptions"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <g-select :value.sync="formData.roles" placeholder="请选择角色" all-select :options="roleOptions"></g-select>
            </el-form-item>
            <el-form-item label="用户状态：" prop="status" :rules="$rules.NotEmpty">
                <el-switch
                        v-model="formData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="Y"
                        inactive-value="N"
                >
                </el-switch>
            </el-form-item>
            <el-form-item label="地址：" prop="address" :rules="$rules.NotEmpty">
                <!-- 这边这样写的原因是g-area中的el-cascader级联选择组件在选中数据的时候会有点延迟，导致校验出现不可控的问题，使用el-input里面放数据的方式进行校验可以解决该问题呢 -->
                <el-input v-show="false" v-model="formData.address" placeholder="placeholder"></el-input>
                <g-area :value.sync="formData.address" width="300px"></g-area>
            </el-form-item>
            <el-form-item label="按钮：">
                <div v-for="buttonModule in formData.buttons" :key="buttonModule.value">
                    <div>{{buttonModule.name}}</div>
                    <el-checkbox-group v-model="buttonModule.selectedButtons">
                        <el-checkbox v-for="button in buttonModule.buttons" :label="button.value" :key="button.value">
                            {{button.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/28 16:21
     */

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
                    vm.formData.avatar = res.data.name;
                    vm.$forceUpdate();
                    vm.$message.success("上传成功");
                })
            },
            //子组件校验，传递到父组件
            validateForm() {
                let flag = null;
                this.$refs['formData'].validate(valid => {
                    if (valid) {
                        flag = true
                    } else {
                        flag = false
                    }
                });
                return flag
            }
        }
    }
</script>

<style lang='scss' scoped>
    .EditForm {

    }
</style>
