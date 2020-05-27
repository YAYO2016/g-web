<template>
    <div class="Tags">
        <!--el-scrollbar  当tags很多的时候，需要进行水平的滚动显示-->
        <el-scrollbar class='scroll-container'>
            <el-tag
                    :key="tag.name"
                    size="small"
                    v-for="tag in tags"
                    :closable="tag.name !== 'Home'"
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                    @click="clickMenu(tag)"
                    :effect="$route.name === tag.name ? 'dark' : 'plain'"
            >
                <!--:closable="tag.meta.name !== 'Home'"  首页不给关闭-->
                {{ tag.meta.title }}
            </el-tag>
        </el-scrollbar>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/3/15 22:32
     */
    import {mapState, mapMutations, mapActions} from 'vuex'

    export default {
        name: "Tabs",
        data() {
            return {}
        },
        computed: {
            ...mapState({
                tags: state => state.common.tabsList
            })
        },
        methods: {
            handleClose(tag) {
                let vm = this;
                vm.$store.dispatch("common/closeTab", tag);
            },
            clickMenu(item) {
                let vm = this;
                vm.$router.push({name: item.name});
                vm.$store.dispatch('common/selectMenu', item)
            }
        }
    }
</script>

<style lang='scss' scoped>
    .Tags {
        padding: 0 15px;
        height: $tabsHeight;
        line-height: $tabsHeight;
        background: $white;
        border-bottom: 1px solid #d8dce5;

        .el-tag {
            margin-right: 15px;
            cursor: pointer;
        }

        .scroll-container {
            white-space: nowrap;
            position: relative;
            overflow: hidden;
            width: 100%;
            height: $tabsHeight;

            /deep/ {
                .el-scrollbar__bar {
                    bottom: 0;
                }

                .el-scrollbar__wrap {
                    /* 解决自定义滚动条 x 轴显示问题 */
                    overflow-x: hidden;
                    height: 49px;
                }
            }
        }
    }
</style>
