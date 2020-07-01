<template>
    <div class='InfoList'>
        <el-form ref="searchForm" :model="searchForm" label-width="70px" inline>
            <el-form-item label="类型">
                <g-select :value.sync="searchForm.type"></g-select>
            </el-form-item>
            <el-form-item label="日期">
                <g-date type="daterange" :start-date.sync="searchForm.startDate"
                        :end-date.sync="searchForm.endDate"></g-date>
            </el-form-item>
            <el-form-item label="关键字">
                <g-select :value.sync="searchForm.keywordType" width="80px" placeholder=""></g-select>
                <g-split-v></g-split-v>
                <g-input :value.sync="searchForm.keyword"></g-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary">新增</el-button>
            </el-form-item>
        </el-form>
        <g-table :table-data="tableData" :select-data.sync="selectData">
            <!-- 多选表格 需要添加selection -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="manager" label="管理员"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text">编辑</el-button>
                    <el-button type="text">删除</el-button>
                </template>
            </el-table-column>
        </g-table>
        <el-row :gutter="10">
            <el-col :span="6" align="left">
                <g-split-l></g-split-l>
                <el-button>批量删除</el-button>
            </el-col>
            <el-col :span="18">
                <g-pagination class="fr" :currentPage="pageInfo.pageNum"
                              :pageSize="pageInfo.pageSize"
                              :total="pageInfo.total"
                              :changePage="page=>getData(page,pageInfo.pageSize)"
                              :pageSizes="[10, 20, 50, 100]"
                              :changeSize="size=>getData(pageInfo.pageNum,size)"
                >
                </g-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/30 22:55
     */

    export default {
        name: "InfoList",
        data() {
            return {
                searchForm: {
                    type: "",
                    startDate: "",
                    endDate: "",
                    keywordType: "",
                    keyword: ""
                },
                tableData: [],
                selectData: [],
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .InfoList {
        @include content-box;
    }
</style>
