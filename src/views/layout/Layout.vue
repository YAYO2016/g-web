<template>
    <el-container class="Layout">
        <el-aside width="auto" class="aside-container">
            <Aside/>
        </el-aside>
        <el-container>
            <el-header>
                <Header/>
            </el-header>
            <Tags></Tags>
            <el-main id="content-main">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
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

        .el-header {
            position: relative;
            opacity: 0.9;
            /*box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);*/
            box-shadow: 0 3px 16px rgba(0, 0, 0, 0.1);

        }

        .el-main {
            opacity: 0.9;
            padding: 32px;
            position: relative;
            box-sizing: border-box;
        }
    }
</style>
