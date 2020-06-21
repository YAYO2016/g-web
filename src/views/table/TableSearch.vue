<template>
    <div class='TableSearch'>
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
                            <el-input v-model="searchForm.bankName" placeholder="请输入"
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
                <el-button type="text" :style="{color:'#F56C6C'}">删除</el-button>
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
     * Created by yanyue on 2020/6/20 20:28
     */

    export default {
        name: "TableSearch",
        data() {
            return {
                searchForm: {
                    bankName: '',
                    bankId: '',
                },
                searchKeyForm: {
                    bankName: '',
                    bankId: '',
                },
                tableData: [],
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
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
                    bankName: "",
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
    .TableSearch {
        @include content-box;
    }
</style>
