<template>
    <div class="Layout">
        <router-view/>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/3/15 15:55
     */

    export default {
        name: "Layout",
        data() {
            return {}
        },
        computed: {

        },
        methods: {

        }
    }
</script>

<style lang='scss' scoped>
    .Layout {
        background-image: url(../../assets/imgs/bg.jpg);
        background-repeat: repeat;
        background-position: top center;
        background-attachment: scroll;
        background-color: #fff;
    }
</style>
