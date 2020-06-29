<template>
    <div class='UserManager'>
        <el-button style="float: right" type="primary" @click="handleAddUser">新增用户</el-button>
        <g-split-l></g-split-l>
        <el-form ref="search" :model="search" label-width="80px" inline>
            <el-form-item label="用户名">
                <el-input v-model="search.input" placeholder="用户名查询" style="width: 250px" clearable></el-input>
            </el-form-item>
            <el-form-item label="创建日期">
                <g-date type="datetimerange" :start-date.sync="search.createStartDate"
                        :end-date.sync="search.createEndDate"></g-date>
            </el-form-item>
            <el-form-item label="角色">
                <g-select :value.sync="search.roles"
                          :allSelect="true"
                          :options="[{label: '管理员', value: 'admin'},{label: '游客', value: 'visitor'}]"
                ></g-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetForm('search')">重置</el-button>
            </el-form-item>
        </el-form>
        <g-split-l></g-split-l>
        <g-table :table-data="tableData" :select-data.sync="selectData">

            <!-- 多选表格 需要添加selection -->
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column type="index" label="序号">
                <template slot-scope="scope">{{(pageInfo.pageNum-1)*pageInfo.pageSize+scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱地址"></el-table-column>
            <el-table-column prop="createDate" label="创建日期" :formatter="gRowTimeFormat"></el-table-column>
            <el-table-column prop="lastLoginDate" label="最后登录日期" :formatter="gRowTimeFormat"></el-table-column>
            <el-table-column prop="roles" label="角色" :formatter="(row,column)=>{
            return  row[column.property]?row[column.property].replace('visitor','游客').replace('admin','管理员'):'';
            }"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click.stop="handleView(scope.row)">查看</el-button>
                    <el-button type="text" @click.stop="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" style="color:#F56C6C " @click.stop="">删除</el-button>
                </template>
            </el-table-column>
        </g-table>
        <g-pagination :currentPage="pageInfo.pageNum"
                      :pageSize="pageInfo.pageSize"
                      :total="pageInfo.total"
                      :changePage="getData">
        </g-pagination>
        <el-button style="float: left;position:relative;top: -40px;">批量删除</el-button>

        <div class="dialog">
            <!-- 1.将提交等逻辑写在父组件中，调用子组件中的校验方法校验通过之后，然后执行父组件中的提交数据逻辑 -->
            <g-dialog title="编辑用户" :show.sync="editFormVisible" @closedDialog="editForm=initForm()">
                <!-- 注意 formData 父组件如果传递给子组件的是一个对象，引用类型的变量的时候，父子组件实际上是共用一个变量的，
                 所以就子组件修改了值，父组件中的值也会发生改变-->
                <EditForm ref="editForm" :formData="editForm"></EditForm>
                <div class="textCenter">
                    <el-button type="primary" @click="editSure('editForm')">确认</el-button>
                    <el-button @click="editFormVisible=false">取消</el-button>
                </div>
            </g-dialog>

            <!-- 2.将提交等逻辑写在子组件表单中，但是需要将模态框的开启和关闭传递给子组件，子组件内部执行校验和提交数据操作 -->
            <g-dialog title="新增用户" :show.sync="addFormVisible" @closedDialog="addForm=initAddForm()">
                <AddForm :show.sync="addFormVisible" :formData="addForm"></AddForm>
            </g-dialog>

            <g-dialog title="查看用户" :show.sync="viewFormVisible" @closedDialog="viewForm=initForm()">
                <ViewForm :formData="viewForm"></ViewForm>
            </g-dialog>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/27 15:14
     */
    import EditForm from "./components/EditForm"
    import AddForm from "./components/AddForm"
    import ViewForm from "./components/ViewForm"

    export default {
        name: "UserManager",
        components: {EditForm, AddForm, ViewForm},
        data() {
            return {
                search: this.initSearch(),
                searchKey: this.initSearch(),
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                },

                tableData: [],
                selectData: [], // 多选表格选中的选项

                // 编辑
                editFormVisible: false,
                editForm: this.initForm(),

                // 新增
                addFormVisible: false,
                addForm: this.initAddForm(),

                // 查看
                viewFormVisible: false,
                viewForm: this.initForm(),

            }
        },
        mounted() {
            let vm = this;
            vm.getData();
        },
        methods: {
            getData(currentPage = 1) {
                let vm = this;
                vm.pageInfo.pageNum = currentPage;
                vm.$api.getAllUsers({
                    username: vm.searchKey.input,
                    createStartDate: vm.searchKey.createStartDate,
                    createEndDate: vm.searchKey.createEndDate,
                    roles: vm.searchKey.roles,
                    pageNum: vm.pageInfo.pageNum,
                    pageSize: vm.pageInfo.pageSize,
                }).then(res => {
                    //如果输入的页面不是第一页，并且没有数据的话，那就查询第一页的数据返回
                    if (vm.pageInfo.pageNum !== 1 && res.data === null && res.data === []) {
                        vm.getData(1);
                    }
                    vm.tableData = res.data.list;
                    vm.pageInfo = res.data.pageInfo;
                })
            },
            handleSearch() {
                let vm = this;
                //只有点击查询按钮的时候，关键字才会进行接口查询，不然只是个临时的数据而已
                vm.searchKey = vm.search;
                vm.getData();
            },
            handleEdit(row) {
                let vm = this;
                vm.$api.getSingleUser({_id: row._id}).then(res => {
                    let result = res.data;
                    vm.editForm = result;
                    vm.editFormVisible = true;
                })
            },
            // 通过调用子组件中的校验方法 实现子组件中表单选项的校验
            editSure(formName) {
                let vm = this;
                if (vm.$refs[formName].validateForm()) {
                    vm.$api.editUser(vm.editForm).then(res => {
                        vm.editFormVisible = false;
                        vm.$message.success("用户信息编辑成功");
                        vm.getData();
                    })
                } else {
                    vm.$message.error("输入有误");
                }
            },
            initForm() {
                return {
                    _id: "",
                    username: "",
                    email: "",
                    avatar: "",
                    roles: ""
                }
            },
            initAddForm() {
                return {
                    username: "",
                    email: "",
                    password: "",
                    repeatPassword: "",
                    avatar: "",
                    roles: ""
                }
            },
            initSearch() {
                return {
                    input: '',
                    createStartDate: "",
                    createEndDate: "",
                    roles: ""
                }
            },
            resetForm(formName) {
                let vm = this;
                // 这边无效  resetFields()，调用resetFields()方法，将表单数据重置为初始值
                // 初始值在表单生命周期的mounted钩子中被赋值
                // 所以，调用resetFields()只会重置为初始值，而不是空值
                //vm.$refs[formName].resetFields();
                vm.search = this.initSearch();
            },
            //页面点击新增用户的按钮
            handleAddUser() {
                let vm = this;
                vm.addFormVisible = true;
            },
            //页面点击查看
            handleView() {
                let vm = this;
                vm.viewFormVisible = true;
            }
        }
    }
</script>

<style lang='scss' scoped>
    .UserManager {
        @include content-box;
    }
</style>
