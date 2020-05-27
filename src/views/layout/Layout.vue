<template>
    <div class="Layout">
        <el-aside width="auto" class="aside-container">
            <Aside/>
        </el-aside>
        <el-container>
            <el-header>
                <Header/>
            </el-header>
            <Tags></Tags>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/3/15 15:55
     */
    import Aside from "./components/Aside"
    import Header from "./components/Header";
    import Tags from "./components/Tags";

    export default {
        name: "Layout",
        components: {Aside, Header, Tags},
        data() {
            return {}
        },
        computed: {},
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .Layout {
        height: 100%;
        background-image: url(../../assets/imgs/bg.jpg);
        background-repeat: repeat;
        background-position: top center;
        background-attachment: scroll;
        background-color: #fff;
    }
</style>
