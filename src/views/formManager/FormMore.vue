<template>
    <div class='FormMore'>
        <!-- 多个表单的校验 -->
        <div class="first-title">表单1</div>
        <el-form ref="formOne" :model="formOne" label-width="80px">
            <el-form-item label="用户名：" prop="username" :rules="$rules.NotEmpty">
                <el-input v-model="formOne.username" placeholder="请输入" style="width: 175px"></el-input>
            </el-form-item>
        </el-form>

        <el-divider></el-divider>

        <div class="first-title">表单2</div>
        <el-form ref="formTwo" :model="formTwo" label-width="80px">
            <el-form-item label="性别：" prop="sex" :rules="$rules.NotEmpty">
                <el-input v-model="formTwo.sex" placeholder="请输入" style="width: 175px"></el-input>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-button type="primary" @click="submit(['formOne','formTwo'])">提交</el-button>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/21 17:21
     */

    export default {
        name: "FormMore",
        data() {
            return {
                formOne: {
                    username: ""
                },
                formTwo: {
                    sex: ""
                }
            }
        },
        methods: {
            // 提交表单，校验当前页面中的多个表单
            submit(formArr = []) {
                let vm = this;
                if (formArr.length === 0) {
                    return
                }
                Promise.all(
                    formArr.map(form => {
                        return vm.$refs[form].validate();
                    })
                ).then(() => {
                    //校验成功
                    vm.$message.success("提交成功")
                }).catch(() => {
                    //校验失败
                    vm.$message.error("输入有误")
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .FormMore {
        @include content-box;
    }
</style>
