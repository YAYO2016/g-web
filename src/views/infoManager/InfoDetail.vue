<template>
    <div class='InfoDetail'>
        <!-- 信息详情 -->
        InfoDetail
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/7/5 20:15
     */

    export default {
        name: "InfoDetail",
        data() {
            return {
                infoId: "",
            }
        },
        created() {
            let vm = this;
            //获取路由参数中返回的infoId
            vm.infoId = vm.$route.query.infoId;
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .InfoDetail {

    }
</style>
