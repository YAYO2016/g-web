<template>
    <div class='FormTest'>
        <el-form ref="testForm" :model="testForm" label-width="140px">
            <el-form-item label="普通输入：" class="fl">
                <el-input v-model="testForm.value" clearable style="width: 175px"></el-input>
            </el-form-item>
            <el-form-item label="普通输入框2：" class="fl">
                <g-input :value.sync="testForm.value1"></g-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="输入数字：" class="fl">
                <g-input type="number" :value.sync="testForm.number"></g-input>
            </el-form-item>
            <el-form-item label="只能输入正数：" class="fl">
                <g-input type="inputPositive" :value.sync="testForm.number1"></g-input>
            </el-form-item>
            <el-form-item label="只能输入正整数：" class="fl">
                <g-input type="inputPositive" :value.sync="testForm.number2"></g-input>
            </el-form-item>
            <el-form-item label="货币输入：" class="fl">
                <g-input type="money" :value.sync="testForm.number3"></g-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="日期选择：" class="fl">
                <el-date-picker type="date" v-model="testForm.date" placeholder="请输入" style="width: 175px"
                                clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="日期选择2：" class="fl">
                <g-date :value.sync="testForm.date2"></g-date>
            </el-form-item>
            <el-form-item label="日期时间选择：" class="fl">
                <g-date type="datetime" :value.sync="testForm.date3"></g-date>
            </el-form-item>
            <el-form-item label="日期区间选择：" class="fl">
                <g-date type="daterange" :startDate.sync="testForm.startDate" :endDate.sync="testForm.endDate"
                        width="350px"></g-date>
            </el-form-item>
            <el-form-item label="日期时间选择：" class="fl">
                <g-date type="datetimerange" :startDate.sync="testForm.startDate2" :endDate.sync="testForm.endDate2"
                        width="350px"></g-date>
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
                    date: new Date(),
                    date2: new Date(),
                    date3: new Date(),
                    startDate: "",
                    endDate: "",
                    startDate2: new Date(),
                    endDate2: new Date(),

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
