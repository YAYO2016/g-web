<template>
    <div class="Tags">
        <!--el-scrollbar  当tags很多的时候，需要进行水平的滚动显示-->
        <el-scrollbar ref="scrollContainer" class='scroll-container' :vertical="false"
                      @wheel.native.prevent="handleScroll">
            <!-- @wheel.native.prevent 添加鼠标滚轮的横向滚动事件-->
            <el-tag
                    :key="tag.name"
                    size="small"
                    v-for="(tag,index) in tags"
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
            }),
            scrollWrapper() {
                return this.$refs.scrollContainer.$refs.wrap
            }
        },
        mounted() {
            this.scrollWrapper.addEventListener('scroll', this.emitScroll, true)
        },
        beforeDestroy() {
            this.scrollWrapper.removeEventListener('scroll', this.emitScroll)
        },
        methods: {
            handleClose(tag) {
                let vm = this;
                //获取当前的路由地址
                let currentPath = vm.$route.path;
                //点击关闭tags
                vm.$store.dispatch("common/closeTab", tag);
                if (currentPath === tag.path) {
                    //关闭的当前的路由，需要跳转到其他路由去，我这边定义跳转到到最后一个存在的tags里面去
                    vm.$router.push(vm.tags[vm.tags.length - 1].path)
                }
            },
            clickMenu(item) {
                let vm = this;
                vm.$router.push({name: item.name});
                vm.$store.dispatch('common/selectMenu', item)
            },
            handleScroll(e) {
                const eventDelta = e.wheelDelta || -e.deltaY * 40;
                const $scrollWrapper = this.scrollWrapper;
                $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
            },
            emitScroll() {
                this.$emit('scroll')
            },
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
