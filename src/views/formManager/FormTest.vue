<template>
    <div class='FormTest'>
        <el-form ref="testForm" :model="testForm" label-width="140px">
            <el-form-item label="普通输入：" class="fl">
                <el-input v-model="testForm.value" placeholder="请输入" clearable style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="普通输入框2：" class="fl">
                <g-input :value.sync="testForm.value1" placeholder="请输入" clearable width="175px"></g-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="输入数字：" class="fl">
                <g-input type="number" v-model="testForm.number" placeholder="请输入" clearable></g-input>
            </el-form-item>
            <el-form-item label="只能输入正数：" class="fl">
                <g-input type="inputPositive" v-model="testForm.number1" placeholder="请输入" clearable></g-input>
            </el-form-item>
            <el-form-item label="只能输入正整数：" class="fl">
                <g-input type="inputPositive" v-model="testForm.number2" placeholder="请输入" clearable></g-input>
            </el-form-item>
            <el-form-item label="货币输入：" class="fl">
                <g-input type="money" v-model="testForm.number3" placeholder="请输入" clearable></g-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
        </el-form>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/31 10:28
     * 表单元素的练习
     */

    export default {
        name: "FormTest",
        data() {
            return {
                testForm: {
                    value: "",
                    value1: "yanyue",
                    number: 0,
                    number1: 0,
                    number2: 0,
                    number3: 0,

                }
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .FormTest {
        @include content-box;
    }
</style>
