<template>
    <div class='FormCycle'>
        <!-- 循环表单 -->
        <el-form ref="person" :model="person" label-width="80px">
            <el-form-item prop="name" label="用户名" :rules="$rules.NotEmpty">
                <el-input v-model="person.name" placeholder="请输入" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item prop="age" label="年龄" :rules="$rules.NotEmpty">
                <el-input v-model="person.age" placeholder="请输入" style="width: 250px;"></el-input>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="12">
                    <g-table
                            :table-data="person.banks"
                    >
                        <el-table-column
                                prop="bankName"
                                label="银行名称">
                            <template slot-scope="scope">
                                <el-form-item :prop="`banks.${scope.$index}.bankName`" :rules="$rules.NotEmpty">
                                    <el-input v-model="scope.row.bankName" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="bankNum"
                                label="用户卡号">
                            <template slot-scope="scope">
                                <el-form-item :prop="`banks.${scope.$index}.bankNum`" :rules="$rules.NotEmpty">
                                    <el-input v-model="scope.row.bankNum" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope"></template>
                            <!--自定义表头 -->
                            <template slot="header" slot-scope="scope">
                                <label>操作</label>
                                <el-button style="float: right" type="primary" @click="addBanks">+</el-button>
                            </template>
                            <template slot-scope="scope">
                                <el-button type="text" @click="deleteBanks(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </g-table>
                </el-col>
            </el-row>

        </el-form>

        <el-divider></el-divider>

        <el-button type="primary" @click="submit('person')">提交</el-button>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/21 19:34
     */

    export default {
        name: "FormCycle",
        data() {
            return {
                person: {
                    name: "",
                    age: "",
                    banks: [
                        {bankName: "工商银行", bankNum: "402821000000"}
                    ]
                }
            }
        },
        methods: {
            addBanks() {
                let vm = this;
                vm.person.banks.push({
                    bankName: "", bankNum: ""
                })
            },
            deleteBanks(index) {
                let vm = this;
                console.log(index);
                if (vm.person.banks.length <= 1) {
                    return
                } else {
                    // 删除数组中的一个元素
                    vm.person.banks.splice(index, 1)
                }
            },
            submit(formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.$message.success("提交成功")
                    } else {
                        vm.$message.error("输入有误")
                    }
                });
            }
        }
    }
</script>

<style lang='scss' scoped>
    .FormCycle {
        @include content-box;
    }
</style>
