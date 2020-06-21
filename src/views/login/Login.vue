<template>
    <div class='Login'>
        <div style="position: fixed;top: 20px;right: 20px;">
            <el-button type="text" @click="changeLocale">中文/EN</el-button>
        </div>
        <div class="container">
            <div class="panel">
                <div class="content">
                    <div class="switch">
                        <h1 id="login">{{$t("login.title")}}</h1>
                    </div>
                    <el-form ref="loginForm" :model="loginForm">
                        <div class="login-form">
                            <div class="txtb">
                                <!--<input type="text" v-model="loginForm.username"/>-->
                                <!-- 这边 错误的国际化信息 使用函数返回的原因是：
                                 函数的模式返回数据，务必使用函数返回的模式，因为使用一般属性对象，在编译一次后，后面更改语言，不会自动刷新
                                 -->
                                <el-form-item prop="username"
                                              :rules="(()=>[{...$rules.NotEmpty[0],message:$t('rules.usernameNotEmpty')}])()">
                                    <el-input type="text" v-model="loginForm.username" clearable ref="username-input"/>
                                    <span :data-placeholder="$t('login.username')"></span>
                                </el-form-item>
                            </div>

                            <div class="txtb">
                                <el-form-item prop="password"
                                              :rules="(()=>[{...$rules.NotEmpty[0],message:$t('rules.passwordNoEmpty')}])()">
                                    <el-input type="password" v-model="loginForm.password" clearable show-password/>
                                    <span :data-placeholder="$t('login.password')"></span>
                                </el-form-item>

                            </div>

                            <div class="buttons">
                                <span class="signUp"
                                      @click="$router.push('/register')"> {{$t("login.gotoRegister")}}</span>
                                <span class="split">|</span>
                                <span class="forget" @click="$router.push('/forgetPassword')"> {{$t("login.forgetPassword")}}？</span>
                            </div>

                            <button class="login-button" v-if="!loading" @click="handleLogin('loginForm')">
                                {{$t("login.title")}}
                            </button>
                            <button class="login-button loading" v-else>
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
     * Created by yanyue on 2020/5/26 15:44
     */
    import $ from "jquery";
    import {setToken} from "@/common/js/auth.js"

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: "",
                    password: ""
                },
                loading: false,
                redirect: undefined,
                otherQuery: {},
            }
        },
        created() {
            //login页面的enter事件
            let vm = this;
            document.onkeydown = function (e) {
                let key = window.event.keyCode;
                if (key == 13) {
                    vm.handleLogin("loginForm");
                }
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
            //this.$refs['username-input'].focus();
        },
        methods: {
            handleLogin(formName) {
                let vm = this;
                if (vm.validateRules(formName, vm)) {
                    vm.loading = true;
                    vm.$store.dispatch('user/login', vm.loginForm)
                        .then((res) => {
                            //登录成功，跳转到路由query中redirect参数的路由地址，并且带上剩余的其他路由参数otherQuery
                            vm.$router.push({path: vm.redirect || '/', query: vm.otherQuery});
                            vm.$message.success(res.message);
                            vm.loading = false
                        })
                        .catch(() => {
                            vm.loading = false
                        })
                }
            },
            getOtherQuery(query) {
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur]
                    }
                    return acc
                }, {})
            },
            //中英文切换  --  主要就是改变  vm.$i18n.locale
            changeLocale() {
                let vm = this;
                let locale = vm.$i18n.locale;
                locale === "zh" ? (vm.$i18n.locale = "en") : (vm.$i18n.locale = "zh");
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    const query = route.query;  //获取路由参数 ?后面的
                    if (query) {
                        //提取出路由参数中的redirect 和剩余的其他参数otherQuery
                        this.redirect = query.redirect;
                        this.otherQuery = this.getOtherQuery(query)
                    }
                },
                immediate: true  //会在create的时候就进行调用
            }
        },
    }
</script>

<style lang='scss' scoped>
    .Login {
        height: 100%;
        /*水平处置居中*/
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
                                color: rgba(125, 116, 255, 0.44);
                                transform: translateY(-50%);
                                z-index: -1;
                                transition: .5s;
                                font-size: 1.1rem;
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
