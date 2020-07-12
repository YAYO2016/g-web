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
            <el-main>
                <!-- loading-area 这边为啥单独写个div loading-area了，
                 因为http.js中的局部loading绑定一个dom，但是el-main本身的宽度是固定的，里面的dom可以滚动，但是高度不会变化，
                 这样的话，当里面dom很长的时候，loading的高度是无法完全覆盖住超过el-main高度的dom的，
                 这个时候就需要创建一个loading-area，并且设置相关的样式 min-height: 100%; 可以解决问题-->
                <div class="loading-area">
                    <!--keep-alive vue内置组件，能在组件切换过程中将状态保存在内存中，防止重复渲染dom-->
                    <keep-alive>
                        <!-- 需要缓存的路由 根据路由组件中meta参数里面的keepAlive进行判断-->
                        <router-view v-if="$route.meta.keepAlive"/>
                    </keep-alive>
                    <!-- 不需要缓存的路由 -->
                    <router-view v-if="!$route.meta.keepAlive"/>
                </div>
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
            position: relative;
            padding: 0;
        }

        .loading-area {
            min-height: 100%;
            padding: 32px;
            /*padding: 32px 32px 0 32px;*/
            box-sizing: border-box;
        }
    }
</style>
