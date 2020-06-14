<template>
    <div class='FormTable'>
        <g-table :tableData="tableData">
            <!-- 普通表格 -->
            <!-- index 添加下标 -->
            <!--<el-table-column type="index" width="50"></el-table-column>-->
            <el-table-column type="index" label="序号">
                <template slot-scope="scope">{{(pageInfo.pageNum-1)*pageInfo.pageSize+scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="bankNo" label="银行编号"></el-table-column>
            <el-table-column prop="branchNo" label="分支编号"></el-table-column>
            <el-table-column prop="bankName" label="银行名称"></el-table-column>
            <el-table-column prop="ownerCounty" label="所在地"></el-table-column>
            <el-table-column label="操作">
                <el-button type="text">编辑</el-button>
                <el-button type="text" :style="{color:variables.danger}">删除</el-button>
            </el-table-column>
        </g-table>
        <g-pagination :currentPage="pageInfo.pageNum"
                      :pageSize="pageInfo.pageSize"
                      :total="pageInfo.total"
                      :changePage="getData">
        </g-pagination>

        <el-divider></el-divider>
        <g-table :tableData="tableData" :select-data.sync="selectData">
            <!-- 多选表格 需要添加selection -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="bankNo" label="银行编号"></el-table-column>
            <el-table-column prop="branchNo" label="分支编号"></el-table-column>
            <el-table-column prop="bankName" label="银行名称"></el-table-column>
            <el-table-column prop="ownerCounty" label="所在地"></el-table-column>
            <el-table-column label="操作">
                <el-button type="text">编辑</el-button>
                <el-button type="text" :style="{color:variables.danger}">删除</el-button>
            </el-table-column>
        </g-table>
        <g-pagination :currentPage="pageInfo.pageNum"
                      :pageSize="pageInfo.pageSize"
                      :total="pageInfo.total"
                      :changePage="getData">
        </g-pagination>
        <el-divider></el-divider>

        <g-table :tableData="tableData">
            <!-- 表头带搜索框的 -->
            <el-table-column prop="bankNo" label="银行编号"></el-table-column>
            <el-table-column prop="branchNo" label="分支编号"></el-table-column>
            <el-table-column prop="bankName" label="银行名称">
                <template slot="header" slot-scope="scope">
                    <el-popover
                            placement="bottom"
                            width="250"
                            trigger="click">
                        <span slot="reference">银行名称 <i
                                :class="searchKeyForm.bankName?'el-icon-search active':'el-icon-search'"></i></span>
                        <div class="popoverContent">
                            <el-button type="text" @click="()=>{searchForm.bankName='';handleSearch()}">清除搜索</el-button>
                            <el-input autofocus v-model="searchForm.bankName" placeholder="请输入"
                                      @keyup.enter.native="handleSearch()">
                                <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
                            </el-input>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="ownerCounty" label="所在地"></el-table-column>
            <el-table-column label="操作">
                <el-button type="text">编辑</el-button>
                <el-button type="text" :style="{color:variables.danger}">删除</el-button>
            </el-table-column>
        </g-table>
        <g-pagination :currentPage="pageInfo.pageNum"
                      :pageSize="pageInfo.pageSize"
                      :total="pageInfo.total"
                      :changePage="getData">
        </g-pagination>


    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/6 15:05
     */

    import variables from '@/common/style/variables.scss'

    export default {
        name: "FormTable",
        data() {
            return {
                selectData: [],
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
            }
        },
        computed: {
            variables() {
                return variables;
            }
        },
        mounted() {
            this.getData(1);
        },
        methods: {
            getData(currentPage = 1) {
                let vm = this;
                vm.pageInfo.pageNum = currentPage;
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
            handleSearch() {
                let vm = this;
                vm.searchKeyForm = {...vm.searchForm};
                vm.getData(1);
            },
        }
    }
</script>

<style lang='scss' scoped>
    .FormTable {
        @include content-box;
    }
</style>
