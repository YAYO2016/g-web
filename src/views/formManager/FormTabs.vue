<template>
    <div class='FormTabs'>
        <ul>
            <li :class="{active:activeTab==='nanjing'}" @click="activeTab='nanjing'">南京</li>
            <li :class="{active:activeTab==='beijing'}" @click="activeTab='beijing'">北京</li>
            <li :class="{active:activeTab==='shanghai'}" @click="activeTab='shanghai'">上海</li>
            <li :class="{active:activeTab==='chengdu'}" @click="activeTab='chengdu'">成都</li>
        </ul>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/7/9 20:56
     * 自定义tabs
     */

    export default {
        name: "FormTabs",
        data() {
            return {
                activeTab: 'nanjing'
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .FormTabs {
        ul {
            li {
                position: relative;
                width: 200px;
                height: 25px;
                line-height: 25px;
                float: left;
                border: 1px solid #000;
                text-align: center;
                margin: 0 0 -1px -1px;
                z-index: 0;

                &.active {
                    z-index: 1;
                    color: #409eff;
                    border: 1px solid #409eff;
                    background-color: #ecf5ff;
                }
            }
        }
    }
</style>
