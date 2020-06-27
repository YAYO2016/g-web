<template>
    <div class='BankList'>
        <el-form ref="form" :model="searchForm" label-width="80px">
            <el-form-item label="银行名称" class="fl">
                <!--带有建议的输入框-->
                <g-auto-complete :data="searchForm" :valueKey="'bankName,ownerCounty(NoBack),bankId(NoShow)'"
                                 :querySearchFunction="querySearchFunction"
                                 :itemsLength="'medium'"
                                 :width="'200px'"
                ></g-auto-complete>
            </el-form-item>
            <g-split-v></g-split-v>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form>
        <g-table :table-data="tableData">
            <el-table-column type="index" label="序号">
                <template slot-scope="scope">{{(pageInfo.pageNum-1)*pageInfo.pageSize+scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="bankId" label="银行id" width="80px"></el-table-column>
            <el-table-column prop="bankName" label="银行名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bankNo" label="总银行编号"></el-table-column>
            <el-table-column prop="branchNo" label="分行编号"></el-table-column>
            <el-table-column prop="ownerCounty" label="所属地"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleEditBank(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </g-table>
        <g-pagination :currentPage="pageInfo.pageNum"
                      :pageSize="pageInfo.pageSize"
                      :total="pageInfo.total"
                      :changePage="getData"
                      :pageSizes="[10, 20, 50, 100]"
                      :changeSize="(size)=>getData(pageInfo.pageNum,size)"
        >
        </g-pagination>


        <!--
        sync是vue的语法糖，
        <comp :foo.sync="bar"></comp>
        相当于
        <comp :foo="bar" @update:foo="val => bar = val"></comp>
        用子组件传来的参数更新父组件的变量 foo
        -->
        <g-dialog :title="'银行信息'" :show.sync="bankFormDialogVisible" @closedDialog="bankForm=bankFormInit()">
            <el-form ref="form" :model="bankForm" label-width="120px">
                <el-form-item label="银行id">
                    <el-input v-model="bankForm.bankId" placeholder="placeholder"></el-input>
                </el-form-item>
                <el-form-item label="银行名称">
                    <el-input v-model="bankForm.bankName" placeholder="placeholder"></el-input>
                </el-form-item>
                <el-form-item label="总银行编号">
                    <el-input v-model="bankForm.bankNo" placeholder="placeholder"></el-input>
                </el-form-item>
                <el-form-item label="分行编号">
                    <el-input v-model="bankForm.branchNo" placeholder="placeholder"></el-input>
                </el-form-item>
                <el-form-item label="所属地">
                    <el-input v-model="bankForm.ownerCounty" placeholder="placeholder"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">确认</el-button>
                    <el-button @click="bankFormDialogVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </g-dialog>

    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/4/5 19:14
     */

    export default {
        name: "BankList",
        data() {
            return {
                tableData: [],
                searchForm: {
                    bankName: '',
                    bankId: '',
                },
                searchKeyForm: {
                    bankName: '',
                    bankId: '',
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                bankForm: this.bankFormInit(),
                bankFormDialogVisible: false,
            }
        },
        mounted() {
            this.getData(1);
        },
        methods: {
            getData(currentPage = 1, currentSize = 10) {
                let vm = this;
                vm.pageInfo.pageNum = currentPage;
                vm.pageInfo.pageSize = currentSize;
                return vm.$api.getBanks({
                    bankName: vm.searchKeyForm.bankName,
                    pageNum: vm.pageInfo.pageNum,
                    pageSize: vm.pageInfo.pageSize
                }).then(res => {
                    //如果输入的页面不是第一页，并且没有数据的话，那就查询第一页的数据返回
                    if (vm.pageInfo.pageNum !== 1 && res.data === null && res.data.list === []) {
                        vm.getData(1);
                    }
                    vm.tableData = res.data.list;
                    vm.pageInfo = res.data.pageInfo;
                })
            },
            querySearchFunction(queryString) {
                let vm = this;
                return vm.$api.getBankInfo({
                    bankName: queryString,
                    pageNum: 1,
                    pageSize: 999
                    // 我觉得一个下拉框显示999个数据已经很多了
                }).then(res => {
                    return res.data;
                })
            },
            handleSearch() {
                let vm = this;
                vm.searchKeyForm = {...vm.searchForm};
                vm.getData(1);
            },
            bankFormInit() {
                return {
                    bankId: "",
                    bank_name: "",
                    bank_no: "",
                    branch_no: "",
                    owner_county: ""
                }
            },
            handleEditBank(row) {
                let vm = this;
                vm.bankForm = row;
                vm.bankFormDialogVisible = true;
            }

        }
    }
</script>

<style lang='scss' scoped>
    .BankList {
        @include content-box;
    }
</style>
