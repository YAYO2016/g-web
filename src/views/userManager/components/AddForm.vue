<template>
    <div class='AddForm'>
        <el-form ref="formData" :model="formData" label-width="100px">
            <el-form-item label="用户名：" class="fl" prop="username" :rules="[{...$rules.NotEmpty[0],message:'用户名不能为空'}]">
                <el-input v-model="formData.username" style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" class="fl" prop="email" :rules="$rules.EmailRule">
                <el-input v-model="formData.email" style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="密码：" class="fl" prop="password" :rules="$rules.PasswordRule">
                <el-input type="password" v-model="formData.password" style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" class="fl" prop="repeatPassword"
                          :rules="[...$rules.PasswordRule,{validator: validatePassWord, trigger: ['blur','change']}]">
                <el-input type="password" v-model="formData.repeatPassword" style="width: 175px"></el-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="头像：" prop="avatar" class="upload"
                          :rules="[{...$rules.NotEmpty[0],message:'上传图片不能为空'}]"
                          ref="upload">
                <!-- 用来校验图片是否上传的 -->
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
    import sha1 from 'js-sha1';

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
        mounted() {
            // 调试bus总线test
            let vm = this;
            // 在bus总线上注册方法
            vm.$bus.$on('showFun', (data) => {
                console.log(data);
            })
        },
        computed: {},
        data() {
            const validatePassWord = (rule, value, callback) => {
                if (value !== this.formData.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback()
                }
            };
            return {
                imageUrl: "",
                roleOptions: [
                    {label: "管理员", value: "admin"},
                    {label: "游客", value: "visitor"}
                ],
                fileMaxSize: 50,
                validatePassWord: validatePassWord,
                fileList: [],
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
            handleUploadRemove(file, fileList) {
                let vm = this;
                vm.formData.avatar = ""
            },
            addSure(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    // 新增用户  调用接口
                    // 删除对象中的一个属性 delete
                    delete vm.formData.repeatPassword;
                    //console.log(vm.registerForm);
                    // 注册的时候 对密码进行加密处理sha1
                    vm.$api.register({...vm.formData, password: sha1(vm.formData.password)}).then(res => {
                        vm.$emit('update:show', false);
                        vm.$message.success("注册成功");
                        // 出现问题  如果注册完新的用户，那么就要更新列表，这个时候调用父组件中的方法，很麻烦,需要组件在绑定父组件的方法
                        vm.$emit("getData");
                    }).catch((err) => {
                        vm.$emit('update:show', false);
                        vm.$message.success(err);
                    })
                }
            }
        },
        watch: {
            'formData.roles': {
                handler(newVal) {
                    console.log(newVal);
                }
            },
            'formData.address': {
                handler(newVal) {
                    console.log(newVal);
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .AddForm {

    }
</style>
