<template>
    <div class='InfoList'>
        <el-form ref="searchForm" :model="searchForm" label-width="70px" inline>
            <el-form-item label="类型">
                <g-select :value.sync="searchForm.categoryId" :options="$store.state.info.categoryList"
                          option-key="infoCategoryName"
                          option-value="infoCategoryId"
                ></g-select>
            </el-form-item>
            <el-form-item label="日期">
                <g-date type="daterange" :start-date.sync="searchForm.startDate"
                        :end-date.sync="searchForm.endDate"></g-date>
            </el-form-item>
            <el-form-item label="关键字">
                <g-select :value.sync="searchForm.keywordType" width="80px" placeholder=""></g-select>
                <g-split-v></g-split-v>
                <g-input :value.sync="searchForm.keyword"></g-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary" @click="addInfoVisible=true">新增</el-button>
            </el-form-item>
        </el-form>
        <g-table :table-data="tableData" :select-data.sync="selectData">
            <!-- 多选表格 需要添加selection -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="categoryName" label="类型">
                <template slot-scope="scope">
                    {{categoryFormat(scope.row.infoCategoryId)}}
                </template>
            </el-table-column>
            <el-table-column prop="createDate" label="日期" :formatter="gRowTimeFormat"></el-table-column>
            <el-table-column prop="creatorName" label="管理员"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text">编辑</el-button>
                    <el-button type="text">删除</el-button>
                </template>
            </el-table-column>
        </g-table>
        <el-row :gutter="10">
            <el-col :span="6" align="left">
                <g-split-l></g-split-l>
                <el-button>批量删除</el-button>
            </el-col>
            <el-col :span="18">
                <g-pagination class="fr" :currentPage="pageInfo.pageNum"
                              :pageSize="pageInfo.pageSize"
                              :total="pageInfo.total"
                              :changePage="page=>getData(page,pageInfo.pageSize)"
                              :pageSizes="[10, 20, 50, 100]"
                              :changeSize="size=>getData(pageInfo.pageNum,size)"
                >
                </g-pagination>
            </el-col>
        </el-row>


        <div class="dialog">
            <g-dialog :show.sync="addInfoVisible" title="新增信息" @closedDialog="addInfoForm=infoFormInit()">
                <el-form ref="addInfoForm" :model="addInfoForm" label-width="80px">
                    <el-form-item label="类别" prop="category" :rules="$rules.NotEmpty">
                        <g-select :value.sync="addInfoForm.category" :options="$store.state.info.categoryList"
                                  option-key="infoCategoryName"
                                  option-value="infoCategoryId"
                                  :returnItem="true"
                        >
                            <!--returnItem 设置为true，返回的就是当前选中的item对象本身-->
                        </g-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="title" :rules="$rules.NotEmpty">
                        <el-input v-model="addInfoForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="概况" prop="content" :rules="$rules.NotEmpty">
                        <el-input type="textarea" v-model="addInfoForm.content"></el-input>
                    </el-form-item>
                    <el-form-item align="center" label-width="0">
                        <el-button @click="addInfoVisible=false">取消</el-button>
                        <el-button type="primary" @click="addInfoSure('addInfoForm')">确认</el-button>
                    </el-form-item>
                </el-form>
            </g-dialog>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/6/30 22:55
     */

    export default {
        name: "InfoList",
        data() {
            return {
                searchForm: {
                    categoryId: "",
                    startDate: "",
                    endDate: "",
                    keywordType: "",
                    keyword: ""
                },
                tableData: [],
                selectData: [],
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },
                addInfoVisible: false,
                addInfoForm: this.infoFormInit(),
                editInfoVisible: false,
                editInfoForm: this.infoFormInit(),
            }
        },
        mounted() {
            let vm = this;
            vm.$store.dispatch('info/getCategoryList');

            vm.getData();
        },
        filters: {
            //过滤器中无法获取当前vue实例，尤雨溪人为filter应该是纯函数，
            //如果想要使用this的话，可以使用computed去处理
            //categoryFilter(infoCategoryId) {
            //    let vm = this;
            //    return vm.$store.state.info.categoryList.filter(category => {
            //        return category.infoCategoryId === infoCategoryId;
            //    })[0].infoCategoryName;
            //}
        },
        methods: {
            getData(currentPage = 1, currentSize = 10) {
                let vm = this;
                vm.pageInfo.pageNum = currentPage;
                vm.pageInfo.pageSize = currentSize;
                vm.$api.getAllInfo({
                    pageNum: vm.pageInfo.pageNum,
                    pageSize: vm.pageInfo.pageSize
                }).then(res => {
                    //如果输入的页面不是第一页，并且没有数据的话，那就查询第一页的数据返回
                    if (vm.pageInfo.pageNum !== 1 && res.data === null && res.data.list === []) {
                        vm.getData(1);
                    }
                    vm.tableData = res.data.list;
                    vm.pageInfo = res.data.pageInfo;
                })
            },
            infoFormInit() {
                return {
                    category: {},
                    title: "",
                    content: ""
                }
            },
            categoryFormat(infoCategoryId) {
                let vm = this;
                return vm.$store.state.info.categoryList.filter(category => {
                    return category.infoCategoryId === infoCategoryId;
                })[0].infoCategoryName;
            },
            addInfoSure(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    vm.$api.addOrEditInfo({
                        creatorId: vm.$store.state.user.userInfo._id,
                        creatorName: vm.$store.state.user.userInfo.username,
                        title: vm.addInfoForm.title,
                        content: vm.addInfoForm.content,
                        infoCategoryName: vm.addInfoForm.category.infoCategoryName,
                        infoCategoryId: vm.addInfoForm.category.infoCategoryId,
                    }).then(res => {
                        vm.$message.success("新增信息成功");
                        vm.addInfoVisible = false;
                        vm.getData(vm.pageInfo.pageNum, vm.pageInfo.pageSize);
                    })
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .InfoList {
        @include content-box;
    }
</style>
