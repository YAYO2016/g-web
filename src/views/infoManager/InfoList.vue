<template>
    <div class='InfoList'>
        <el-form ref="searchForm" :model="searchForm" label-width="70px" inline>
            <el-form-item label="类型">
                <g-select :value.sync="searchForm.infoCategoryId" :options="$store.state.info.categoryList"
                          option-key="infoCategoryName"
                          option-value="infoCategoryId"
                ></g-select>
            </el-form-item>
            <el-form-item label="创建日期">
                <g-date type="daterange" :start-date.sync="searchForm.startDate"
                        :end-date.sync="searchForm.endDate"></g-date>
            </el-form-item>
            <el-form-item label="关键字">
                <g-select :value.sync="searchForm.keywordKey" width="80px" placeholder="" :options="[
                {label:'ID',value:'infoId'},{label:'标题',value:'title'},{label:'类型',value:'infoCategoryName'},{label:'管理员',value:'creatorName'},
                ]"
                          :changeFun="()=>searchForm.keyword=''"
                ></g-select>
                <g-split-v></g-split-v>
                <g-input :value.sync="searchForm.keyword"></g-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="searchForm=initSearchForm()">重置</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button v-btn-perm="'infoManager.add'" type="primary" @click="addInfoVisible=true">新增</el-button>
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
            <el-table-column prop="createDate" label="创建日期" :formatter="gRowTimeFormat"></el-table-column>
            <el-table-column prop="creatorName" label="管理员"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-btn-perm="'infoManager.view'" type="text" @click.stop="handleViewInfo(scope.row)">查看
                    </el-button>
                    <el-button v-btn-perm="'infoManager.edit'" type="text" @click.stop="handleEditInfo(scope.row)">编辑
                    </el-button>
                    <!-- 可以直接编写跳转函数，也可以使用router-link -->
                    <!--<router-link :to="{path:'/info/infoDetail',query:{infoId:scope.row.infoId}}">编辑详情</router-link>-->
                    <el-button v-btn-perm="'infoManager.edit'" type="text"
                               @click.stop="handleEditInfoDetail(scope.row)">
                        编辑详情
                    </el-button>
                    <el-button v-btn-perm="'infoManager.delete'" type="text" class="dangerColor"
                               @click.stop="handleDeleteInfo(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </g-table>
        <el-row :gutter="10">
            <el-col :span="6" align="left">
                <g-split-l></g-split-l>
                <el-button @click="handleDeleteBatchInfo(selectData)">批量删除</el-button>
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
            <!-- 新增信息模态框 -->
            <g-dialog :show.sync="addInfoVisible" title="新增信息" @closedDialog="addInfoForm=infoFormInit()">
                <el-form ref="addInfoForm" :model="addInfoForm" label-width="80px">
                    <el-form-item label="类别" prop="category" :rules="$rules.NotEmpty">
                        <!-- 技术点：这边的数据传递的是option对象，并不是option中的id -->
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

            <!-- 编辑信息模态框 -->
            <g-dialog :show.sync="editInfoVisible" title="编辑信息" @closedDialog="editInfoForm=infoFormInit()">
                <el-form ref="editInfoForm" :model="editInfoForm" label-width="80px">
                    <el-form-item label="类别" prop="category" :rules="$rules.NotEmpty">
                        <!-- 技术点：这边的数据传递的是option对象，并不是option中的id -->
                        <g-select :value.sync="editInfoForm.category" :options="$store.state.info.categoryList"
                                  option-key="infoCategoryName"
                                  option-value="infoCategoryId"
                                  :returnItem="true"
                        >
                        </g-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="title" :rules="$rules.NotEmpty">
                        <el-input v-model="editInfoForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content" :rules="$rules.NotEmpty">
                        <el-input type="textarea" v-model="editInfoForm.content"></el-input>
                    </el-form-item>
                    <el-form-item align="center" label-width="0">
                        <el-button @click="editInfoVisible=false">取消</el-button>
                        <el-button type="primary" @click="editInfoSure('editInfoForm')">确认</el-button>
                    </el-form-item>
                </el-form>
            </g-dialog>

            <!-- 查看模态框 -->
            <g-dialog :show.sync="viewInfoVisible" title="新增信息" @closedDialog="viewInfoForm=infoFormInit()">
                <el-form ref="viewInfoForm" :model="viewInfoForm" label-width="80px">
                    <el-form-item label="类别" prop="category" :rules="$rules.NotEmpty">
                        <!-- 技术点：这边的数据传递的是option对象，并不是option中的id -->
                        <g-select :value.sync="viewInfoForm.category" :options="$store.state.info.categoryList"
                                  option-key="infoCategoryName"
                                  option-value="infoCategoryId"
                                  :returnItem="true"
                                  disabled
                        >
                            <!--returnItem 设置为true，返回的就是当前选中的item对象本身-->
                        </g-select>
                    </el-form-item>
                    <el-form-item label="标题" prop="title" :rules="$rules.NotEmpty">
                        <el-input v-model="viewInfoForm.title" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="概况" prop="content" :rules="$rules.NotEmpty">
                        <el-input type="textarea" v-model="viewInfoForm.content" readonly></el-input>
                    </el-form-item>
                    <el-form-item align="center" label-width="0">
                        <el-button @click="viewInfoVisible=false">取消</el-button>
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
                searchForm: this.initSearchForm(),
                //做一个临时的key，是为了当不是点击搜索的时候，比如点击翻页的时候，
                //如果页面已经将搜索表单数据清空，但是没有点击搜索按钮，那么翻页的时候还是要带上原来表单中的数据去查询的
                searchKeyForm: this.initSearchForm(),
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
                viewInfoVisible: false,
                viewInfoForm: this.infoFormInit(),
            }
        },
        mounted() {
            let vm = this;
            vm.$store.dispatch('info/getCategoryList');

            vm.getData();
        },
        filters: {
            //过滤器中无法获取当前vue实例，尤雨溪认为filter应该是纯函数，
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
                    ...vm.searchKeyForm,
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
            //点击搜索按钮
            handleSearch() {
                let vm = this;
                //使用深拷贝，不然后面动态生成的key-value也会一直保存在源数据中，影响下一次的搜索
                vm.searchKeyForm = JSON.parse(JSON.stringify(vm.searchForm));
                //搜索关键字类型是select选择出来的，这边需要动态生成搜索的key-value
                if (vm.searchKeyForm.keywordKey) {
                    vm.searchKeyForm[vm.searchKeyForm.keywordKey] = vm.searchKeyForm.keyword;
                }
                vm.getData(vm.pageInfo.pageNum, vm.pageInfo.pageSize);
            },
            initSearchForm() {
                return {
                    infoCategoryId: "",
                    startDate: "",
                    endDate: "",
                    keywordKey: "",
                    keyword: ""
                }
            },
            infoFormInit() {
                return {
                    category: "",
                    title: "",
                    content: "",
                    thumbPic: ""  //缩略图
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
            },
            // 删除一个信息
            handleDeleteInfo(info) {
                let vm = this;
                vm.$confirm(`<span>此操作将永久删除<span> <span style="color:#f56c6c">${info.title}</span> <span>该信息, 是否继续?</span>`, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    //center: true
                }).then(() => {
                    vm.$api.deleteInfo({infoId: info.infoId}).then(res => {
                        vm.$messsage.success("删除信息成功")
                    });
                    vm.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    vm.getData(vm.pageInfo.pageNum, vm.pageInfo.pageSize);
                }).catch(() => {
                    vm.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //批量删除信息
            handleDeleteBatchInfo(infos = []) {
                let vm = this;
                if (infos.length > 0) {
                    let deleteTitles = "";
                    infos.forEach(info => {
                        deleteTitles += (info.title + ',');
                    });
                    vm.$confirm(`<span>此操作将永久删除<span> <span style="color:#f56c6c">${deleteTitles}</span> <span>该信息, 是否继续?</span>`, '提示', {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        //center: true
                    }).then(async () => {
                        //批量删除  本质上就是一个个的删除
                        await infos.forEach(info => {
                            return vm.$api.deleteInfo({infoId: info.infoId}).then(res => {
                            });
                        });
                        vm.$message.success("批量删除信息成功");
                        vm.getData(vm.pageInfo.pageNum, vm.pageInfo.pageSize);
                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    vm.$message.info("请选择要删除的数据")
                }
            },
            // 表格点击查看按钮
            handleViewInfo(info) {
                let vm = this;
                // 查询数据，赋值给编辑表单，然后打开编辑模态框
                vm.$api.getAllInfo({infoId: info.infoId}).then(res => {
                    vm.viewInfoForm = JSON.parse(JSON.stringify(res.data.list[0]));
                    vm.viewInfoForm.category = {
                        infoCategoryName: vm.viewInfoForm.infoCategoryName,
                        infoCategoryId: vm.viewInfoForm.infoCategoryId
                    };
                    vm.viewInfoVisible = true;
                })
            },
            // 点击编辑按钮
            handleEditInfo(info) {
                let vm = this;
                // 查询数据，赋值给编辑表单，然后打开编辑模态框
                vm.$api.getAllInfo({infoId: info.infoId}).then(res => {
                    vm.editInfoForm = JSON.parse(JSON.stringify(res.data.list[0]));
                    vm.editInfoForm.category = {
                        infoCategoryName: vm.editInfoForm.infoCategoryName,
                        infoCategoryId: vm.editInfoForm.infoCategoryId
                    };
                    vm.editInfoVisible = true;
                })
            },
            //编辑确认按钮
            editInfoSure(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    vm.$api.addOrEditInfo({
                        infoId: vm.editInfoForm.infoId,
                        creatorId: vm.editInfoForm.creatorId,
                        creatorName: vm.editInfoForm.creatorName,
                        title: vm.editInfoForm.title,
                        content: vm.editInfoForm.content,
                        infoCategoryName: vm.editInfoForm.category.infoCategoryName,
                        infoCategoryId: vm.editInfoForm.category.infoCategoryId,
                    }).then(res => {
                        vm.$message.success("编辑信息成功");
                        vm.editInfoVisible = false;
                        vm.getData(vm.pageInfo.pageNum, vm.pageInfo.pageSize);
                    })
                }
            },
            // 点击编辑详情按钮
            handleEditInfoDetail(info) {
                let vm = this;
                // 跳转到编辑详情页面
                vm.$router.push({path: "/info/infoDetail", query: {infoId: info.infoId}})
            }
        }
    }
</script>

<style lang='scss' scoped>
    .InfoList {
        @include content-box;
    }
</style>
