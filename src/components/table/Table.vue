<template>
    <div class="Table">
        <el-table
                ref="GTable"
                :data="tableDataView"
                :size="size"
                :height="height"
                :header-cell-style="{background:'#F5F7FA'}"
                highlight
                highlight-current-row
                border
                stripe
                @row-click="rowClickFun"
                @current-change="handleCurrentChange"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                @select="select"
                tooltip-effect="dark"
        >
            <!-- stripe:是否是斑马纹-->
            <slot></slot>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'GTable',
        props: {
            tableData: {
                type: Array,
                default: []
            },
            // 多选表格  被选中的表格数据
            selectData: {
                type: Array,
                default: () => []
            },
            height: {
                type: String,
            },
            size: {
                type: String,
                default: 'mini'
            }
        },
        data() {
            return {
                tableDataView: [],
                selectDataView: [],
            }
        },
        mounted() {
            this.tableDataView = this.tableData;
            this.selectDataView = this.selectData;
        },
        watch: {
            tableData(newVal) {
                this.tableDataView = newVal;
            },
            tableDataView(newVal) {
                this.$emit("update:tableData", newVal);
            },
            selectData(newVal) {
                this.selectDataView = newVal;
            },
            selectDataView(newVal) {
                this.$emit("update:selectData", newVal);
            },
        },
        methods: {
            // 多选表格 选择函数
            handleSelectionChange(val) {
                this.selectDataView = val;
            },
            // 行点击函数,一般是为了多选表格  点击行的时候就直接添加的作用，而不是必须点击多选框才算选中
            rowClickFun(row, column, event) {
                this.$refs.GTable.toggleRowSelection(row);
            },

            tableRowClassName({row, rowIndex}) {
                //将下标添加到row中去
                row.index = rowIndex;
            },
            handleCurrentChange(val) {
                this.$emit('handleCurrentChange', val);
            },
            handleChange(val) {
                this.$emit('handleChange', val);
            },
            select() {
                this.$emit('select');
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*因为elementUI的table样式是后生成的,无法直接写css去改变,除非写全局的css,所以这里使用scss或者less去修改样式*/
    .Table {
        /deep/ .el-table th.gutter {
            display: table-cell !important;
        }

        /deep/ .el-table__header-wrapper {
            th {
                text-align: center;
            }
        }

        /deep/ .el-table__body-wrapper {
            td {
                text-align: center;

                div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }

</style>
