<template>
    <div class="g-pagination">
        <el-pagination
                background
                :layout="pageSizes.length>0?'prev,pager,next,total,sizes':'prev,pager,next,total'"
                :total="Number(total)"
                @current-change="changePage"
                :current-page="Number(currentPage)"
                :page-size="Number(pageSize)"
                :page-sizes="pageSizes"
                @size-change="changeSize"
        >
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'Pagination',
        data() {
            return {}
        },
        props: {
            total: {
                type: [Number, String],
                default: 0
            },
            pageSizes: {
                type: [Array],
                default: () => []
            },
            currentPage: {
                type: [Number, String],
                default: 1
            },
            pageSize: {
                type: [Number, String],
                default: 10
            },
            changePage: {
                type: Function,
                default: () => {
                }
            },
            changeSize: {
                type: Function,
                default: () => {
                }
            },
        },
        methods: {
            //currentChange(page) {
            //    let vm = this;
            //    vm.$emit('changePage', page);
            //}
        }
    }
</script>

<style scoped>
    .g-pagination {
        text-align: center;
        margin-top: 20px;
    }
</style>
