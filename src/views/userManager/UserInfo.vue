<template>
    <div class='UserInfo'>
        <!--查看当前用户的信息-->
        <g-split-l></g-split-l>
        <el-form label-width="100px">
            <el-form-item label="头像：" class="fl">
                <img :src="iobsUrl + userInfo.avatar" width="200" alt="">
            </el-form-item>
            <div class="fl content" style="height: 200px;line-height: 200px;margin-left: 20px">
                <el-form-item label="用户名：">
                    {{userInfo.username}}
                </el-form-item>
                <el-form-item label="邮箱：">
                    {{userInfo.email}}
                </el-form-item>
                <el-form-item label="用户角色：">
                    {{userRolesComputed}}
                </el-form-item>
            </div>

        </el-form>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/28 22:39
     *
     */

    export default {
        name: "UserInfo",
        data() {
            return {}
        },
        computed: {
            userInfo() {
                return this.$store.state.user.userInfo;
            },
            userRolesComputed() {
                return this.$store.state.user.userInfo.roles.split(',').map(role => {
                    if (role === 'visitor') {
                        return "游客"
                    } else if (role === "admin") {
                        return "管理员"
                    }
                }).join(',')
            }
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .UserInfo {
        height: 100%;
        border-radius: 10px;
        background-color: #bfcbd9;

        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        img {
            border-radius: 50%;
        }
    }
</style>
