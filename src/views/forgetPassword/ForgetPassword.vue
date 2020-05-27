<template>
    <div class='ForgetPassword'>
        <div class="container">
            <div class="panel">
                <div class="content">
                    <div class="switch">
                        <h1 id="signUp">忘记密码</h1>
                    </div>

                    <el-form ref="editForm" :model="editForm">
                        <div class="forget-password-form">
                            <div class="txtb">
                                <el-form-item prop="email" :rules="$rules.EmailRule">
                                    <el-input type="text" v-model="editForm.email" clearable/>
                                    <span data-placeholder="邮箱"></span>
                                </el-form-item>
                            </div>

                            <button class="getEmailCode">点击获取验证码</button>

                            <div class="txtb">
                                <el-form-item prop="verifyCode" :rules="[{...$rules.NotEmpty[0],message:'邮箱验证码不能为空'}]">
                                    <el-input v-model="editForm.verifyCode" clearable/>
                                    <span data-placeholder="邮箱验证码"></span>
                                </el-form-item>
                            </div>

                            <div class="txtb">
                                <el-form-item prop="password" :rules="$rules.PasswordRule">
                                    <el-input type="password" v-model="editForm.password" clearable/>
                                    <span data-placeholder="新密码"></span>
                                </el-form-item>
                            </div>

                            <div class="txtb">
                                <el-form-item prop="repeatPassword"
                                              :rules="[...$rules.PasswordRule,{validator: validatePassWord, trigger: 'blur'}]">
                                    <el-input type="password" v-model="editForm.repeatPassword" clearable/>
                                    <span data-placeholder="确认密码"></span>
                                </el-form-item>
                            </div>

                            <div class="buttons">
                                <span class="signUp" @click="$router.push('/login')">点击跳转登录</span>
                            </div>

                            <button class="submit-button" v-if="!loading" @click="handleEdit('editForm')">提交更改</button>
                            <button class="submit-button loading" v-else>
                                <i class="el-icon-loading" style="font-size: 25px"></i>
                            </button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/27 13:07
     */
    import $ from "jquery";

    export default {
        name: "ForgetPassword",
        data() {
            const validatePassWord = (rule, value, callback) => {
                if (value !== this.editForm.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback()
                }
            };
            return {
                editForm: {
                    email: "",
                    verifyCode: "",
                    password: "",
                    repeatPassword: "",
                },
                validatePassWord: validatePassWord,
                loading: false
            }
        },
        mounted() {
            $(".txtb input").on("focus", function () {
                //$(this).addClass("focus")
                $(this).parent(".el-input").addClass("focus")
            })
            $(".txtb input").on("blur", function () {
                if ($(this).val() == "") {
                    $(this).parent(".el-input").removeClass("focus")
                    //$(this).removeClass("focus");
                }
            })
        },
        methods: {
            handleEdit(formName) {

            }
        }
    }
</script>

<style lang='scss' scoped>
    .ForgetPassword {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url(../../assets/imgs/star.jpg) no-repeat;

        .container {
            position: relative;
            width: 24rem;

            .panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, .8);
                display: flex;
                justify-content: center;
                width: 400px;
                padding: 40px;
                box-sizing: border-box;
                box-shadow: 0 15px 25px rgba(0, 0, 0, .5);
                border-radius: 10px;

                .switch h1 {
                    text-align: center;
                    font-size: 1.4rem;
                    color: rgba(125, 116, 255, .8);
                    border-bottom: rgba(125, 116, 255, .8) solid 2px;
                    cursor: default;
                }

                .forget-password-form {
                    button.getEmailCode {
                        margin-top: -10px;
                        display: block;
                        border: none;
                        outline: none;
                        width: 7rem;
                        border-radius: 5%;
                        background: linear-gradient(90deg, rgba(138, 143, 255, 0.76), rgba(182, 130, 255, 0.76));
                        box-shadow: 0 0 8px #8a8fff;
                        cursor: pointer;
                        color: #d3c2ff;

                        &:hover {
                            background: linear-gradient(90deg, rgba(138, 143, 255, 0.5), rgba(182, 130, 255, 0.51));
                            color: rgba(211, 194, 255, 0.7);
                        }
                    }
                    .txtb {
                        border-bottom: 2px solid rgba(125, 116, 255, .8);
                        position: relative;
                        margin: 30px 0;

                        .el-form-item {
                            margin-bottom: 0;
                        }

                        /deep/ .el-form-item__error {
                            margin-top: 2px;
                            color: #3498db;
                        }

                        /deep/ i {
                            line-height: 40px;
                            color: rgba(37, 215, 202, 0.84);
                        }

                        /deep/ input {
                            font-size: 15px;
                            color: rgba(37, 215, 202, 0.84);
                            border: none;
                            width: 100%;
                            outline: none;
                            background: none;
                            padding: 0 5px;
                            height: 40px;
                            line-height: 40px;
                        }

                        span {
                            &::before {
                                content: attr(data-placeholder);
                                position: absolute;
                                top: 50%;
                                left: 5px;
                                font-size: 1.1rem;
                                color: rgba(125, 116, 255, 0.44);
                                transform: translateY(-50%);
                                z-index: -1;
                                transition: .5s;
                            }

                            &::after {
                                content: '';
                                position: absolute;
                                bottom: -2px;
                                left: 0;
                                width: 0;
                                height: 2px;
                                background: linear-gradient(120deg, #3498db, #8e44ad);
                                transition: .5s;
                            }
                        }

                        .focus + span::before {
                            top: -5px;
                            font-size: 1rem;
                        }

                        .focus + span::after {
                            width: 100%;
                        }
                    }

                    .buttons {
                        text-align: center;


                        .signUp {
                            cursor: pointer;
                            color: #7d74ff;
                            font-size: 0.8rem;
                            text-decoration: none;

                            &:hover {
                                color: rgba(138, 143, 255, 0.4);
                            }
                        }

                        .split {
                            color: #7d74ff;
                            font-size: 0.8rem;
                            cursor: default;
                        }

                        .forget {
                            cursor: pointer;
                            color: #7d74ff;
                            font-size: 0.8rem;
                            text-decoration: none;

                            &:hover {
                                color: rgba(138, 143, 255, 0.4);
                            }
                        }
                    }

                    .submit-button {
                        display: block;
                        border: none;
                        outline: none;
                        margin: 2rem 56px 0;
                        width: 66px;
                        height: 66px;
                        border-radius: 50%;
                        background: linear-gradient(90deg, #8a8fff, rgb(216, 174, 255));
                        box-shadow: 0 0 8px #8a8fff;
                        cursor: pointer;
                        transition: .4s;

                        &:not(.loading):hover {
                            border: none;
                            outline: none;
                            margin: 2rem -7px 0;
                            width: 100%;
                            height: 3.5rem;
                            border-radius: 3rem;
                            background: linear-gradient(90deg, rgba(138, 143, 255, 0.75), rgba(216, 174, 255, 0.75));
                            box-shadow: 0 0 8px #8a8fff;
                            cursor: pointer;
                            color: rgba(0, 0, 0, 0.6);
                            transition: .4s;
                        }
                    }


                }
            }

        }
    }
</style>
