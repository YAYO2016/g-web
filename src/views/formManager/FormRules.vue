<template>
    <div class='FormRules'>
        <div class="first-title">1.暂存不校验，提交校验的表单</div>
        <el-form ref="personForm" :model="form" label-width="80px" style="width: 450px"
                 :validate-on-rule-change="false">
            <el-form-item prop="name" :rules="validate?$rules.NotEmpty:{}">
                <span slot="label">姓名：</span>
                <el-input v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="年龄：" prop="age" :rules="validate?$rules.NotEmpty:{}">
                <el-input v-model="form.age" clearable></el-input>
            </el-form-item>
            <el-form-item label="爱好：" prop="favourites" :rules="validate?$rules.NotEmpty:{}">
                <el-select v-model="form.favourites" clearable placeholder="请选择爱好">
                    <el-option label="足球" value="football"></el-option>
                    <el-option label="篮球" value="basketball"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <!-- 重置 会清除表单的数据  并且消除已经显示的错误提示 -->
                <el-button @click="$refs['personForm'].resetFields()">重置</el-button>
                <el-button type="" @click="save('personForm')">暂存</el-button>
                <el-button type="primary" @click="submit('personForm')">提交</el-button>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/21 14:51
     */

    export default {
        name: "FormRules",
        data() {
            return {
                form: {
                    name: '',
                    age: '',
                    favourites: ''
                },
                validate: false
            }
        },
        methods: {
            save(formName) {
                let vm = this;
                vm.validate = false;
                vm.$refs[formName].clearValidate();
                vm.$message.success("保存成功");
            },
            submit(formName) {
                let vm = this;
                vm.validate = true;
                vm.$nextTick(() => {
                    if (vm.validateRules(formName, vm)) {
                        vm.$message.success("提交成功");
                    }
                })

            },
        }
    }
</script>

<style lang='scss' scoped>
    .FormRules {
        @include content-box;

    }
</style>
