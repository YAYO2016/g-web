<template>
    <!-- 信息列表页面 -->
    <div class='InfoCategory'>
        <div>
            <el-button type="primary" @click="addCategoryType='first'">添加一级分类</el-button>
        </div>
        <el-divider></el-divider>
        <el-row :gutter="30">
            <el-col :span="8" style="min-width: 350px">
                <div class="category-wrapper">
                    <div class="category-item" v-for="(category,index) in categoryList" :key="category.infoCategoryId">
                        <h4>
                            <svg-icon icon-class="plus"></svg-icon>
                            {{category.infoCategoryName}}
                            <div class="button-group">
                                <el-button round type="primary" @click="">编辑</el-button>
                                <el-button round type="success"
                                           @click="handleAddChildCategory(category.infoCategoryId)">添加子级
                                </el-button>
                                <el-button round>删除</el-button>
                            </div>
                        </h4>
                        <ul>
                            <li v-for="categoryChild in category.children" :key="categoryChild.infoCategoryId">
                                {{categoryChild.infoCategoryName}}
                                <div class="button-group">
                                    <el-button round type="primary">编辑</el-button>
                                    <el-button round type="success">添加子级</el-button>
                                    <el-button round>删除</el-button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </el-col>
            <el-col :span="16">
                <div class="menu-wrapper">
                    <h4 class="menu-title">一级分类编辑</h4>
                    <el-form ref="categoryForm" :model="categoryForm" label-width="142px"
                             style="width: 410px;padding-top: 26px">
                        <el-form-item label="一级分类名称" v-if="addCategoryType == 'first' || addCategoryType=='both'"
                                      prop="firstCategory"
                                      :rules="$rules.NotEmpty">
                            <el-input v-model="categoryForm.firstCategory"></el-input>
                        </el-form-item>
                        <el-form-item label="二级分类名称" v-if="addCategoryType == 'child' || addCategoryType=='both'"
                                      prop="secondCategory"
                                      :rules="$rules.NotEmpty">
                            <el-input v-model="categoryForm.secondCategory"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addCategory('categoryForm')">确定</el-button>
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
        name: "InfoCategory",
        data() {
            return {
                categoryList: [],
                categoryForm: {
                    firstCategory: "",
                    secondCategory: ""
                },
                addCategoryType: 'first',
                tempChildCategoryParentId: "",

            }
        },
        mounted() {
            let vm = this;
            vm.getCategoryData();
        },
        methods: {
            //获取分类信息
            getCategoryData() {
                let vm = this;
                vm.$api.getAllCategory().then(res => {
                    vm.categoryList = res.data.list;
                })
            },
            //新增分类信息
            addCategory(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    if (vm.categoryForm.firstCategory) {
                        vm.$api.infoAddCategory({
                            infoCategoryName: vm.categoryForm.firstCategory,
                            level: 1
                        }).then(res => {
                            vm.$message.success("新增一级分类成功！");
                            vm.getCategoryData();
                            vm.categoryForm.firstCategory = ""
                        })
                    }
                    if (vm.categoryForm.secondCategory) {
                        vm.$api.infoAddCategory({
                            infoCategoryName: vm.categoryForm.secondCategory,
                            level: 2,
                            parentId: vm.tempChildCategoryParentId
                        }).then(res => {
                            vm.$message.success("新增二级分类成功！");
                            vm.getCategoryData();
                            vm.categoryForm.secondCategory = ""
                        })
                    }
                }
            },
            //添加子级别的类别
            handleAddChildCategory(parentId) {
                let vm = this;
                vm.tempChildCategoryParentId = parentId;
                vm.addCategoryType = 'child';
            }
        }
    }
</script>

<style lang='scss' scoped>
    .InfoCategory {
        @include content-box;

        .category-wrapper div:last-child {
            &:before {
                bottom: 21px;
            }
        }

        .category-item {
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
                z-index: 2;
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
