<template>
    <div class='FormComponents'>
        <!-- 一些自定义的表单控件 -->
        <el-form ref="myForm" :model="myForm">
            <el-form-item label="用户名" class="form-item-single1">
                <el-input v-model="myForm.username" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/21 15:07
     */

    export default {
        name: "FormComponents",
        data() {
            return {
                myForm: {
                    username: ""
                }
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .FormComponents {
        @include content-box;

    }
</style>
