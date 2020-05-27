<template>
    <el-scrollbar class="Aside el-scrollbar">
        <el-menu
                class="el-menu-vertical-demo el-menu-slide"
                :default-active="$route.path"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :collapse="isCollapse"
                mode="vertical"
                router
        >
            <!--:active-text-color="variables.menuActiveText"-->
            <!--
                el-menu 设置了router属性后，el-menu-item中index值就是点击时候的路由跳转值
                default-active 激活的路由地址
                background-color 背景颜色
                text-color 文本颜色
                active-text-color 激活时候的文本颜色
                mode vertical 垂直菜单模式（默认）  horizontal 水平菜单模式
                unique-opened 是否只能同时打开一个菜单，其他的会收起
                collapse 是否折叠
                @open="handleOpen" 打开一个submenu会执行的事件
                @close="handleClose" 关闭一个submenu会执行的事件
                @select="handleSelect" 点击某个el-menu-item菜单选项的时候会执行的事件
            -->
            <!--<h3 class="title" v-show="!isCollapse">严跃后台管理系统</h3>-->
            <!--<h3 class="title" v-show="isCollapse">严跃</h3>-->
            <template v-for="item in routes"
                      v-if="!item.hidden && item.children && item.children.length > 0">
                <!--单个元素的-->
                <el-menu-item v-if="item.children.length === 1" :index="item.children[0].path"
                              :key="item.children[0].path"
                              @click="clickMenu(item.children[0])">
                    <i v-if="item.children[0].meta.icon" :class="`${item.children[0].meta.icon}`"></i>
                    <span slot="title" :title="item.children[0].meta.title">{{item.children[0].meta.title}}</span>
                </el-menu-item>

                <!--子菜单：多个子元素的-->
                <el-submenu v-else :index="item.children[0].path" :key="item.children[0].path">
                    <!--父目录名称-->
                    <template slot="title">
                        <i v-if="item.meta.icon" :class="`${item.meta.icon}`"></i>
                        <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
                    </template>
                    <!--子菜单名称-->
                    <el-menu-item v-for="child in item.children" v-if="!child.hidden" :index='child.path'
                                  :key="child.path"
                                  @click="clickMenu(child)">
                        <i v-if="child.meta.icon" :class="`${child.meta.icon}`"></i>
                        <span v-if="child.meta&&child.meta.title" slot="title" :title="child.meta.title">{{child.meta.title}}</span>
                    </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </el-scrollbar>
</template>

<script>
    /**
     * Created by yanyue on 2020/3/15 15:59
     */
    import variables from '@/common/style/variables.scss'
    import {mapState} from 'vuex'

    export default {
        name: "Aside",
        data() {
            return {}
        },
        computed: {
            ...mapState('permission', ['routes']),
            isCollapse() {
                return this.$store.state.common.isCollapse
            },
            variables() {
                return variables;
            }
        },
        methods: {
            clickMenu(item) {
                let vm = this;
                vm.$store.dispatch('common/selectMenu', item)
            }
        }
    }
</script>

<style lang='scss' scoped>
    .Aside {
        &.el-scrollbar {
            height: 100%;
            border-right: 1px solid $menuBg;
            background: $menuBg;
            opacity:0.9;

            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden;
            }

            .el-menu-slide {
                border-right: none;

                i {
                    margin-right: 5px;
                    width: 24px;
                    text-align: center;
                    font-size: 18px;
                }
            }
        }

        .el-menu {
            height: 100%;

            .title {
                color: $white;
                text-align: center;
                line-height: $headerHeight;
            }

            li {
                /*菜单内容如果太长的话，使用省略号*/
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .el-menu-slide {
            border-right: none;

            i {
                margin-right: 5px;
                width: 24px;
                text-align: center;
                font-size: 18px;
            }
        }

        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
            min-height: 400px;
        }
    }


</style>
