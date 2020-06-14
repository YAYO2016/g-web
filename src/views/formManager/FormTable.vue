<template>
    <div class='FormTable'>
        <g-table :tableData="tableData">
            <!-- 普通表格 -->
            <!-- index 添加下标 -->
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="bankNo" label="用户编号"></el-table-column>
            <el-table-column prop="branchNo" label="分支编号"></el-table-column>
            <el-table-column prop="bankName" label="银行名称"></el-table-column>
            <el-table-column prop="ownerCounty" label="所在地"></el-table-column>
            <el-table-column label="操作">
                <el-button type="text">编辑</el-button>
                <el-button type="text" :style="{color:variables.danger}">删除</el-button>
            </el-table-column>
        </g-table>
        <el-divider></el-divider>
        <g-table :tableData="tableData" :select-data.sync="selectData">
            <!-- 多选表格 需要添加selection -->
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- index 添加下标 -->
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="bankNo" label="用户编号"></el-table-column>
            <el-table-column prop="branchNo" label="分支编号"></el-table-column>
            <el-table-column prop="bankName" label="银行名称"></el-table-column>
            <el-table-column prop="ownerCounty" label="所在地"></el-table-column>
            <el-table-column label="操作">
                <el-button type="text">编辑</el-button>
                <el-button type="text" :style="{color:variables.danger}">删除</el-button>
            </el-table-column>
        </g-table>
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
                tableData: [
                    {
                        "_id": "5e8c8865b8ec98ae17e84917",
                        "bankId": 1,
                        "correspondentNo": 402828000000,
                        "bankName": "天祝县藏族自治县农村信用合作联社华干路分社",
                        "bankNo": 402821000000,
                        "branchNo": 8284,
                        "ownerCounty": "天祝县",
                        "index": 0
                    }, {
                        "_id": "5e8c8865b8ec98ae17e8490c",
                        "bankId": 2,
                        "correspondentNo": 402829000000,
                        "bankName": "定西市通渭县城关信用社",
                        "bankNo": 402821000000,
                        "branchNo": 8292,
                        "ownerCounty": "通渭县",
                        "index": 1
                    }, {
                        "_id": "5e8c8865b8ec98ae17e84924",
                        "bankId": 3,
                        "correspondentNo": 402829000000,
                        "bankName": "通渭县农村信用合作联社",
                        "bankNo": 402821000000,
                        "branchNo": 8292,
                        "ownerCounty": "通渭县",
                        "index": 2
                    }, {
                        "_id": "5e8c8865b8ec98ae17e84909",
                        "bankId": 4,
                        "correspondentNo": 402829000000,
                        "bankName": "甘肃省通渭县农村信用合作联社碧玉信用社",
                        "bankNo": 402821000000,
                        "branchNo": 8292,
                        "ownerCounty": "通渭县",
                        "index": 3
                    }, {
                        "_id": "5e8c8865b8ec98ae17e84919",
                        "bankId": 5,
                        "correspondentNo": 402829000000,
                        "bankName": "定西市通渭县鸡川信用社",
                        "bankNo": 402821000000,
                        "branchNo": 8292,
                        "ownerCounty": "通渭县",
                        "index": 4
                    }, {
                        "_id": "5e8c8865b8ec98ae17e84918",
                        "bankId": 6,
                        "correspondentNo": 402829000000,
                        "bankName": "甘肃省通渭县农村信用合作联社新景信用社",
                        "bankNo": 402821000000,
                        "branchNo": 8292,
                        "ownerCounty": "通渭县",
                        "index": 5
                    }, {
                        "_id": "5e8c8865b8ec98ae17e8491b",
                        "bankId": 7,
                        "correspondentNo": 402829000000,
                        "bankName": "定西市通渭县陇山信用社",
                        "bankNo": 402821000000,
                        "branchNo": 8292,
                        "ownerCounty": "通渭县",
                        "index": 6
                    }, {
                        "_id": "5e8c8865b8ec98ae17e8491a",
                        "bankId": 8,
                        "correspondentNo": 402885000000,
                        "bankName": "新疆昌吉农村商业银行股份有限公司延安北路支行",
                        "bankNo": 402881000000,
                        "branchNo": 8850,
                        "ownerCounty": "昌吉市",
                        "index": 7
                    }, {
                        "_id": "5e8c8865b8ec98ae17e8490a",
                        "bankId": 9,
                        "correspondentNo": 402885000000,
                        "bankName": "新疆昌吉农村商业银行股份有限公司三工支行",
                        "bankNo": 402881000000,
                        "branchNo": 8850,
                        "ownerCounty": "昌吉市",
                        "index": 8
                    }, {
                        "_id": "5e8c8865b8ec98ae17e8490b",
                        "bankId": 10,
                        "correspondentNo": 402885000000,
                        "bankName": "新疆昌吉农村商业银行股份有限公司军户支行",
                        "bankNo": 402881000000,
                        "branchNo": 8850,
                        "ownerCounty": "昌吉市",
                        "index": 9
                    }]

            }
        },
        computed: {
            variables() {
                return variables;
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .FormTable {
        @include content-box;
    }
</style>
