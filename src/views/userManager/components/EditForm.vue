<template>
    <div class='EditForm'>
        <el-form ref="formData" :model="formData" label-width="100px">
            <el-form-item label="用户名：" class="fl">
                <el-input v-model="formData.username" style="width: 175px" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" class="fl">
                <el-input v-model="formData.email" style="width: 175px" disabled></el-input>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="头像：" class="upload">
                <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="用户角色：">
                <el-select v-model="formData.roles" placeholder="请选择角色" multiple>
                    <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/28 16:21
     */

    export default {
        name: "EditForm",
        props: {
            formData: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        computed: {

        },
        data() {
            return {
                imageUrl: "",
                roleOptions: [
                    {label: "管理员", value: "admin"},
                    {label: "游客", value: "visitor"}
                ]
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style lang='scss' scoped>
    .EditForm {

    }
</style>
