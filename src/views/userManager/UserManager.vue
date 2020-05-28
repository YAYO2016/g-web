<template>
    <div class='UserManager'>
        <div>
            <el-input v-model="search.input" placeholder="用户名查询" style="width: 250px" clearable></el-input>
            <g-split-v></g-split-v>
            <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <g-split-l></g-split-l>
        <g-table :table-data="tableData">
            <el-table-column type="index" label="序号">
                <template slot-scope="scope">{{(pageInfo.pageNum-1)*pageInfo.pageSize+scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱地址"></el-table-column>
            <el-table-column prop="createDate" label="创建日期" :formatter="gRowTimeFormat"></el-table-column>
            <el-table-column prop="lastLoginDate" label="最后登录日期" :formatter="gRowTimeFormat"></el-table-column>
            <el-table-column prop="roles" label="角色"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text">查看</el-button>
                    <el-button type="text">编辑</el-button>
                    <el-button type="text">删除</el-button>
                </template>
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
     * Created by yanyue on 2020/5/27 15:14
     */

    export default {
        name: "UserManager",
        data() {
            return {
                search: {
                    input: '',
                },
                searchKey: {
                    input: '',
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                },
                tableData: [],
            }
        },
        mounted() {
            let vm = this;
            vm.getData();
        },
        methods: {
            getData(currentPage = 1) {
                let vm = this;
                vm.pageInfo.pageNum = currentPage;
                vm.$api.getAllUsers({
                    username: vm.searchKey.input,
                    pageNum: vm.pageInfo.pageNum,
                    pageSize: vm.pageInfo.pageSize,
                }).then(res => {
                    //如果输入的页面不是第一页，并且没有数据的话，那就查询第一页的数据返回
                    if (vm.pageInfo.pageNum !== 1 && res.data === null && res.data === []) {
                        vm.getData(1);
                    }
                    vm.tableData = res.data.list;
                    vm.pageInfo = res.data.pageInfo;
                })
            },
            handleSearch() {
                let vm = this;
                //只有点击查询按钮的时候，关键字才会进行接口查询，不然只是个临时的数据而已
                vm.searchKey.input = vm.search.input;
                vm.getData();
            }
        }
    }
</script>

<style lang='scss' scoped>
    .UserManager {

    }
</style>
