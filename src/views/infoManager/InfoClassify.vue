<template>
    <!-- 信息列表页面 -->
    <div class='InfoClassify'>
        <div>
            <el-button type="primary">添加一级分类</el-button>
        </div>
        <el-divider></el-divider>
        <el-row :gutter="30">
            <el-col :span="8">
                <div class="info-wrapper">
                    <div class="info-item">
                        <h4>
                            <svg-icon icon-class="plus"></svg-icon>
                            新闻
                            <div class="button-group">
                                <el-button round type="primary">编辑</el-button>
                                <el-button round type="success">添加子级</el-button>
                                <el-button round>删除</el-button>
                            </div>
                        </h4>
                        <ul>
                            <li>国内
                                <div class="button-group">
                                    <el-button round type="primary">编辑</el-button>
                                    <el-button round type="success">添加子级</el-button>
                                    <el-button round>删除</el-button>
                                </div>
                            </li>
                            <li>国内</li>
                            <li>国内</li>
                            <li>国内</li>
                        </ul>
                    </div>
                    <div class="info-item">
                        <h4>
                            <svg-icon icon-class="plus"></svg-icon>
                            新闻
                        </h4>
                        <ul>
                            <li>国内</li>
                            <li>国内</li>
                            <li>国内</li>
                            <li>国内</li>
                        </ul>
                    </div>
                </div>

            </el-col>
            <el-col :span="16">
                <div class="menu-wrapper">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form ref="form" :model="form" label-width="142px" style="width: 410px;padding-top: 26px">
                        <el-form-item label="一级分类名称">
                            <el-input v-model="form.one"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称">
                            <el-input v-model="form.two"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>


    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/30 21:20
     */

    export default {
        name: "InfoClassify",
        data() {
            return {
                form: {
                    one: "",
                    two: ""
                }
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .InfoClassify {
        @include content-box;

        .info-wrapper div:last-child {
            &:before {
                bottom: 21px;
            }
        }

        .info-item {
            line-height: 44px;
            position: relative;

            &:before {
                z-index: 2;
                content: "";
                position: absolute;
                width: 32px;
                left: 22px;
                top: 20px;
                bottom: -20px;
                border-left: 1px dotted #000;
            }

            h4 {
                position: relative;
                padding-left: 40px;
            }

            .svg-icon {
                position: absolute;
                left: 14px;
                top: 13px;
                background-color: #fff;
                font-size: 17px;
            }

            li {
                position: relative;
                padding-left: 36px;
                margin-left: 24px;

                &:before {
                    z-index: 2;
                    content: "";
                    position: absolute;
                    width: 32px;
                    left: 0;
                    top: 22px;
                    border-bottom: 1px dotted #000;

                }
            }

            h4, li {
                cursor: pointer;
                /* 添加一个过渡动画的效果 */
                transition: all .3s ease 0s;

                &:hover {
                    background-color: #f3f3f3;

                    .button-group {
                        display: block;
                    }
                }
            }

            .button-group {
                display: none;
                position: absolute;
                right: 11px;
                z-index: 2;
                top: 0;
                button {
                    font-size: 12px;
                    padding: 5px 8px;
                }
            }
        }

        .menu-wrapper {
            .menu-title {
                line-height: 44px;
                padding-left: 22px;
                background-color: #f3f3f3;
            }
        }
    }
</style>
