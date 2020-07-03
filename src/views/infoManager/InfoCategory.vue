<template>
    <!-- 信息列表页面 -->
    <div class='InfoCategory'>
        <div>
            <el-button type="primary" @click="categoryForm=categoryFormInit();$refs['categoryForm'].resetFields()">
                添加一级分类
            </el-button>
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
                                <el-button round type="primary" @click="handleEditCategory(category)">编辑</el-button>
                                <el-button round type="success"
                                           @click="handleAddChildCategory(category.infoCategoryId)">添加子级
                                </el-button>
                                <el-button round @click="deleteCategory(category)">删除</el-button>
                            </div>
                        </h4>
                        <ul>
                            <li v-for="categoryChild in category.children" :key="categoryChild.infoCategoryId">
                                {{categoryChild.infoCategoryName}}
                                <div class="button-group">
                                    <el-button round type="primary" @click="handleEditCategory(categoryChild)">编辑
                                    </el-button>
                                    <!--<el-button round type="success">添加子级</el-button>-->
                                    <el-button round @click="deleteCategory(categoryChild)">删除
                                    </el-button>
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
                        <el-form-item label="一级分类名称" v-if="categoryForm.level == 1"
                                      prop="infoCategoryName"
                                      :rules="$rules.NotEmpty">
                            <el-input v-model="categoryForm.infoCategoryName"></el-input>
                        </el-form-item>
                        <div v-if="categoryForm.children && categoryForm.children.length > 0">
                            <el-form-item
                                    v-for="(category,index) in categoryForm.children"
                                    :key="category.infoCategoryId"
                                    label="二级分类名称"
                                    :prop="`children.${index}.infoCategoryName`"
                                    :rules="$rules.NotEmpty">
                                <el-input v-model="category.infoCategoryName"></el-input>
                            </el-form-item>
                        </div>

                        <el-form-item label="二级分类名称"
                                      v-else-if="categoryForm.level == 2"
                                      prop="infoCategoryName"
                                      :rules="$rules.NotEmpty">
                            <el-input v-model="categoryForm.infoCategoryName"></el-input>
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
                categoryForm: this.categoryFormInit(),
            }
        },
        mounted() {
            let vm = this;
            vm.getCategoryData();
        },
        methods: {
            categoryFormInit() {
                return {
                    infoCategoryName: "",
                    level: 1,
                    parentId: '',
                    infoCategoryId: ''
                }
            },
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
                    //存在一级和二级 同时
                    if (vm.categoryForm.level == 1 && vm.categoryForm.children && vm.categoryForm.children.length > 0) {
                        // 先处理类别一
                        vm.$api.infoAddCategory({
                            infoCategoryName: vm.categoryForm.infoCategoryName,
                            level: vm.categoryForm.level,
                            parentId: vm.categoryForm.parentId,
                            infoCategoryId: vm.categoryForm.infoCategoryId,
                        }).then(res => {
                            if (vm.categoryForm.infoCategoryId) {
                                vm.$message.success("编辑一级分类成功！");
                            } else {
                                vm.$message.success("新增一级分类成功！");
                            }
                            //vm.getCategoryData();
                            //vm.categoryForm.firstCategory = ""
                            //vm.$refs[formName].resetFields();
                        })

                        //然后循环处理类别二
                        vm.categoryForm.children.forEach(category => {
                            vm.$api.infoAddCategory({
                                infoCategoryName: category.infoCategoryName,
                                level: category.level,
                                parentId: category.parentId,
                                infoCategoryId: category.infoCategoryId,
                            }).then(res => {
                                if (category.infoCategoryId) {
                                    vm.$message.success("编辑二级分类成功！");
                                } else {
                                    vm.$message.success("新增二级分类成功！");
                                }
                                //vm.getCategoryData();
                                //vm.categoryForm.firstCategory = ""
                                //vm.$refs[formName].resetFields();
                            })
                        })
                    } else {
                        // 只有一级类别或者二级
                        vm.$api.infoAddCategory({
                            infoCategoryName: vm.categoryForm.infoCategoryName,
                            level: vm.categoryForm.level,
                            parentId: vm.categoryForm.parentId,
                            infoCategoryId: vm.categoryForm.infoCategoryId,
                        }).then(res => {
                            if (vm.categoryForm.infoCategoryId) {
                                vm.$message.success('编辑' + vm.categoryForm.level == 1 ? '一' : '二' + '级分类成功！');
                            } else {
                                vm.$message.success('新增' + vm.categoryForm.level == 1 ? '一' : '二' + '级分类成功！');
                            }
                            //vm.getCategoryData();
                            //vm.categoryForm.firstCategory = ""
                            //vm.$refs[formName].resetFields();
                        })
                    }

                    vm.getCategoryData();
                    vm.categoryForm = vm.categoryFormInit();
                    vm.$refs[formName].resetFields();
                }
            },
            //添加子级别的类别
            handleAddChildCategory(parentId) {
                let vm = this;
                vm.categoryForm = {
                    ...vm.categoryFormInit(),
                    parentId,
                    level: 2
                };
                vm.$refs['categoryForm'].resetFields();

            },
            // 编辑分类
            handleEditCategory(category) {
                let vm = this;
                vm.categoryForm = JSON.parse(JSON.stringify(category));
            },
            // 删除分类
            deleteCategory(category) {
                let vm = this;
                vm.$confirm(`<span>此操作将永久删除<span> <span style="color:#f56c6c">${category.infoCategoryName}</span> <span>该类别, 是否继续?</span>`, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    //center: true
                }).then(() => {
                    //存在一级和二级 同时
                    if (category.level == 1 && category.children && category.children.length > 0) {
                        // 先处理类别一
                        vm.$api.deleteCategory({infoCategoryId: category.infoCategoryId}).then(res => {
                            if (category.level == 1) {
                                vm.$message.success('删除一级分类成功！');
                            } else {
                                vm.$message.success('删除二级分类成功！');
                            }
                        })

                        //然后循环处理类别二
                        category.children.forEach(categoryChild => {
                            vm.$api.deleteCategory({infoCategoryId: categoryChild.infoCategoryId}).then(res => {
                                if (categoryChild.level == 1) {
                                    vm.$message.success('删除一级分类成功！');
                                } else {
                                    vm.$message.success('删除二级分类成功！');
                                }
                            })
                        })
                    } else {
                        // 只有一级类别或者二级
                        vm.$api.deleteCategory({infoCategoryId: category.infoCategoryId}).then(res => {
                            if (category.level == 1) {
                                vm.$message.success('删除一级分类成功！');
                            } else {
                                vm.$message.success('删除二级分类成功！');
                            }
                        })
                    }

                    vm.getCategoryData();
                }).catch(() => {
                    vm.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
