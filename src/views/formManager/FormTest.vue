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
                        width="350px">
                </g-date>
            </el-form-item>
            <el-form-item label="日期选择2(只能选择当前时间之后的时间)：" class="fl" label-width="300px">
                <g-date :value.sync="testForm.date2" :expireStartTime="Date.now()"></g-date>
            </el-form-item>
            <el-form-item label="日期选择2(只能选择当前时间之前的时间)：" class="fl" label-width="300px">
                <g-date :value.sync="testForm.date2" :expireEndTime="Date.now()"></g-date>
            </el-form-item>
            <el-form-item label="日期选择2(只能选择2个时间之间的时间)：" class="fl" label-width="300px">
                <g-date :value.sync="testForm.date2"
                        :expireStartTime="new Date('2020-7-2').getTime()"
                        :expireEndTime="new Date('2020-7-10').getTime()"></g-date>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="普通选择框：" class="fl">
                <el-select v-model="testForm.selectItem" placeholder="请选择" clearable>
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="普通选择框2：" class="fl">
                <g-select :value.sync="testForm.selectItem" :options="options" optionKey="label"
                          optionValue="value"></g-select>
            </el-form-item>
            <el-form-item label="普通选择框（多选）：" class="fl" label-width="160px">
                <g-select :value.sync="testForm.selectItems" :options="options" optionKey="label"
                          optionValue="value" :multiple="true"></g-select>
            </el-form-item>
            <el-form-item label="普通选择框（多选，全选）：" class="fl" label-width="200px">
                <g-select :value.sync="testForm.selectItems" :options="options" optionKey="label"
                          optionValue="value" :multiple="true" :allSelect="true"></g-select>
            </el-form-item>
            <el-form-item label="普通选择框（多选，全选，checkbox）：" class="fl" label-width="290px">
                <g-select type="select-checkbox" :value.sync="testForm.selectItems" :options="options" optionKey="label"
                          optionValue="value" :multiple="true" :allSelect="true"></g-select>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="地址选择：" class="fl">
                <g-area :value.sync="testForm.area" width="200px"></g-area>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="普通树形结构选择：" class="fl">
                <g-tree :value.sync="testForm.selectMenus" :options="menuOptions"
                        width="250px"
                        option-key="name"
                        option-value="children"
                        optionId="id"
                        optionParentId="parentId"
                ></g-tree>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="文件上传：">
                <g-file-upload :file-list.sync="fileList"></g-file-upload>
            </el-form-item>
            <div class="clearfix"></div>
            <el-divider></el-divider>
            <el-form-item label="数字1：" class="fl">
                <el-input style="width:250px"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="testForm.sum1"
                          placeholder="请输入数字">

                </el-input>
            </el-form-item>
            <el-form-item label="" class="fl" label-width="20px">
                <el-select v-model="testForm.calcUse" style="width: 80px">
                    <el-option label="+" value="add"></el-option>
                    <el-option label="-" value="subtract"></el-option>
                    <el-option label="*" value="multiply"></el-option>
                    <el-option label="/" value="divide"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数字2：" class="fl">
                <el-input style="width:250px"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="testForm.sum2"
                          placeholder="请输入数字">
                </el-input>
            </el-form-item>
            <el-form-item label="" class="fl">
                <el-button type="primary" @click="calc">计算(防止精度丢失的mathjs)</el-button>
            </el-form-item>
            <el-form-item label="结果：" class="fl">
                <el-input style="width:250px"
                          readonly
                          v-model="testForm.result"
                          placeholder="">
                </el-input>
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
                    selectItem: "admin",
                    selectItems: "admin,visitor",  //改造后的select多选的value只能是id的字符串，通过逗号连接
                    area: "150421",
                    selectMenus: [3, 9],
                    sum1: '',
                    calcUse: 'add',
                    sum2: '',
                    result: ''
                },
                options: [{label: "管理员", value: "admin"}, {label: "游客", value: "visitor"}],
                menuOptions: [
                    {id: 1, parentId: 0, name: "一级菜单A", rank: 1, disabled: true},  //数据中带disabled就是禁用
                    {id: 2, parentId: 0, name: "一级菜单B", rank: 1},
                    {id: 3, parentId: 0, name: "一级菜单C", rank: 1},
                    {id: 4, parentId: 1, name: "二级菜单A-A", rank: 2},
                    {id: 5, parentId: 1, name: "二级菜单A-B", rank: 2},
                    {id: 6, parentId: 2, name: "二级菜单B-A", rank: 2},
                    {id: 7, parentId: 4, name: "三级菜单A-A-A", rank: 3},
                    {id: 8, parentId: 7, name: "四级菜单A-A-A-A", rank: 4},
                    {id: 9, parentId: 8, name: "五级菜单A-A-A-A-A", rank: 5},
                    {id: 10, parentId: 9, name: "六级菜单A-A-A-A-A-A", rank: 6},
                    {id: 11, parentId: 10, name: "七级菜单A-A-A-A-A-A-A", rank: 7},
                    {id: 12, parentId: 11, name: "八级菜单A-A-A-A-A-A-A-A", rank: 8},
                    {id: 13, parentId: 12, name: "九级菜单A-A-A-A-A-A-A-A-A", rank: 9},
                    {id: 14, parentId: 13, name: "十级菜单A-A-A-A-A-A-A-A-A-A", rank: 10},
                ],
                //文件上传的资料id
                taskId: "001",
                fileList: [{
                    "_events": {},
                    "_eventsCount": 0,
                    "size": 346915164,
                    "path": "C:\\Users\\Administrator\\AppData\\Local\\Temp\\upload_7b511e9d3c292593b92aa08462579d75",
                    "name": "58D60C09F72C5CDC.docx",
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "lastModifiedDate": "2020-06-07T02:11:27.062Z",
                    "fileName": "0.前台.docx",
                    "uploadTime": "2020-06-07T02:11:27.063Z",
                    "progress": 100
                }, {
                    "_events": {},
                    "_eventsCount": 0,
                    "size": 45179,
                    "path": "C:\\Users\\Administrator\\AppData\\Local\\Temp\\upload_8788ec6ffe1ad5f67ce3bf7abf439d64",
                    "name": "43D6D4047C66FEC2.jpeg",
                    "type": "image/jpeg",
                    "hash": null,
                    "lastModifiedDate": "2020-06-07T03:18:02.099Z",
                    "fileName": "20171216094159_QaLXP.jpeg",
                    "uploadTime": "2020-06-07T03:18:02.103Z",
                    "progress": 100
                }]
            }
        },
        methods: {
            //计算--mathjs实现js的高精度的计算
            calc() {
                let vm = this;
                switch (vm.testForm.calcUse) {
                    case "add":
                        //return vm.form.result = vm.$mathjs.add(vm.form.sum1, vm.form.sum2);  //加
                        return vm.testForm.result = vm.$mathjs.number(vm.$mathjs.evaluate(`${vm.testForm.sum1}+${vm.testForm.sum2}`));
                    case "subtract":
                        //return vm.form .result = vm.$mathjs.subtract(vm.form.sum1, vm.form.sum2); //减
                        return vm.testForm.result = vm.$mathjs.number(vm.$mathjs.evaluate(`${vm.testForm.sum1}-${vm.testForm.sum2}`));
                    case "multiply":
                        //return vm.form.result = vm.$mathjs.multiply(vm.form.sum1, vm.form.sum2); //乘
                        return vm.testForm.result = vm.$mathjs.number(vm.$mathjs.evaluate(`${vm.testForm.sum1}*${vm.testForm.sum2}`));
                    case "divide":
                        //return vm.form.result = vm.$mathjs.divide(vm.form.sum1, vm.form.sum2);  //除
                        return vm.testForm.result = vm.$mathjs.number(vm.$mathjs.evaluate(`${vm.testForm.sum1}/${vm.testForm.sum2}`));
                }
            },
        }
    }
</script>

<style lang='scss' scoped>
    .FormTest {
        @include content-box;
    }
</style>
