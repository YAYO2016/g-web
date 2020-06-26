<template>
    <div class='Header'>
        <div class="left-content">
            <el-button type="primary" icon="el-icon-menu"
                       @click="$store.dispatch('common/collapseMenu')"
            ></el-button>
            <!--面包屑导航-->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="bread in breadCrumbItems" :key="bread.path"
                                    :to="{path:bread.path}">
                    {{bread.title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right-content">

            <div class="content-item">
                <g-screen-full></g-screen-full>
            </div>
            <div class="content-item">
                <!--用户相关-->
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link"><img :src="iobsUrl+$store.state.user.userInfo.avatar" class="user"/></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="$router.push('/user/userInfo')">个人中心</el-dropdown-item>
                        <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!--<div class="content-item">-->
            <!--<i class="el-icon-question"></i>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/3/15 15:59
     */
    import {mapState} from 'vuex'

    export default {
        name: "Header",
        data() {
            return {
                userImg: require('@/assets/imgs/visitor.jpg'),
                //面包屑导航数组
                breadCrumbItems: [],
            }
        },
        computed: {
            ...mapState({
                routes: state => state.user.routes
            })
        },
        watch: {
            $route: {
                // 路由改变一次就重新设置一下面包屑导航数据
                handler: function (to, from) {
                    let vm = this;
                    vm.initBreadCrumbItems(to);
                },
                immediate: true, //一开始就执行一次
            }
        },
        methods: {
            initBreadCrumbItems(router) {
                let vm = this;
                //根路由title
                let breadCrumbItems = [{path: '/', title: '后台管理系统'}];
                //let breadCrumbItems = [{path: '/', title: '首页'}];
                //router目标路由参数--也就是当前路由，遍历父级到当前子路由的页面的title和path存储到当前数组中
                for (let index in router.matched) {
                    if (router.matched[index].meta && router.matched[index].meta.title) {
                        breadCrumbItems.push({
                            path: router.matched[index].path ? router.matched[index].path : '/',
                            title: router.matched[index].meta.title
                        })
                    }
                }
                vm.breadCrumbItems = breadCrumbItems;
            },
            collapseMenu() {
                let vm = this;
                vm.$store.dispatch('common/collapseMenu')
            },
            //登出
            logOut() {
                let vm = this;
                vm.$store.dispatch('user/clearCurrentState');
                vm.$store.dispatch('common/clearTabs');
                vm.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }
        }
    }
</script>

<style lang='scss' scoped>
    .Header {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: space-between;

        .left-content {
            display: flex;
            align-items: center;

            .el-button {
                margin-right: 20px;
            }
        }

        .right-content {
            .content-item {
                display: inline-block;
                height: 100%;
                line-height: 100%;
                vertical-align: middle;
                padding: 0 10px;

                i {
                    font-size: 20px;
                }
            }

            .user {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

    }

    .el-dropdown {

    }

    .el-icon-question {
        color: $yellow;
    }

    .el-breadcrumb__item {
        .el-breadcrumb__inner {
            color: #666666;
            font-weight: normal;
        }

        &:last-child {
            .el-breadcrumb__inner {
                color: #ffffff;
            }
        }
    }
</style>
