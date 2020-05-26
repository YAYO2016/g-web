<template>
    <div class='Login'>
        <div class="container">
            <div class="panel">
                <div class="content">
                    <div class="switch">
                        <h1 id="login">登录</h1>
                    </div>

                    <div class="login-form">
                        <div class="txtb">
                            <!--<input type="text" v-model="loginForm.username"/>-->
                            <el-input type="text" v-model="loginForm.username" clearable/>
                            <span data-placeholder="用户名"></span>
                        </div>

                        <div class="txtb">
                            <el-input type="password" v-model="loginForm.password" clearable show-password/>
                            <span data-placeholder="密码"></span>

                        </div>

                        <div class="buttons">
                            <span class="signUp">跳转注册</span>
                            <span class="split">|</span>
                            <span class="forget">忘记密码？</span>
                        </div>

                        <button class="login-button" v-if="!loading" @click="handleLogin">登录</button>
                        <button class="login-button loading" v-else>
                            <i class="el-icon-loading" style="font-size: 25px"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/26 15:44
     */
    import $ from "jquery";

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: "",
                    password: ""
                },
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
            handleLogin() {
                let vm = this;
                vm.loading = true;

            }
        }
    }
</script>

<style lang='scss' scoped>
    .Login {
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

                .login-form {
                    .txtb {
                        border-bottom: 2px solid rgba(125, 116, 255, .8);
                        position: relative;
                        margin: 30px 0;

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
                        }

                        .focus + span::after {
                            width: 100%;
                        }
                    }

                    .buttons {
                        text-align: center;

                        span {
                            margin-right: 5px;
                        }

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

                    .login-button {
                        display: block;
                        border: none;
                        outline: none;
                        margin: 2rem 61px 0;
                        width: 56px;
                        height: 56px;
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
