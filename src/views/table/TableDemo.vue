<template>
    <!--普通表格 -->
    <div class='TableDemo'>
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
     * Created by yanyue on 2020/6/20 20:26
     */

    export default {
        name: "TableDemo",
        data() {
            return {
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
                    pageNum:
                    vm.pageInfo.pageNum,
                    pageSize:
                    vm.pageInfo.pageSize
                }).then(res => {
                    //如果输入的页面不是第一页，并且没有数据的话，那就查询第一页的数据返回
                    if (vm.pageInfo.pageNum !== 1 && res.data === null && res.data.list === []) {
                        vm.getData(1);
                    }
                    vm.tableData = res.data.list;
                    vm.pageInfo = res.data.pageInfo;
                })
            },
        }
    }
</script>

<style lang='scss' scoped>
    .TableDemo {
        @include content-box;
    }
</style>
