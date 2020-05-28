<template>
    <div class='NoFound'>
        <div class="wrapper">
            <a href="#" title="前往二次元">
                <img class="panel-cover__logo" src="@/assets/404imgs/few.jpg" alt="" width="150">
            </a>
            <h1 class="panel-title">
                <a href="#">404</a>
            </h1>
            <hr class="panel-cover__divider">
            <p class="panel-cover__description">对不起，您要找的页面被小萌丢失了，(＞人＜；)</p>
            <hr class="panel-cover__divider panel-cover__divider--secondary">
            <p class="panel-cover__description">欢迎来到我的个人世界!</p>

            <div class="navigation-wrapper">
                <div>
                    <nav class="cover-navigation">
                        <ul class="navigation">
                            <li class="navigation__item"><router-link class="link" to="/">返回首页</router-link></li>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
        <div class="panel-cover--overlay cover-slate"></div>
    </div>
</template>

<script>
    /**
     * Created by yanyue on 2020/5/28 14:20
     */

    export default {
        name: "NoFound",
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
    .NoFound {
        width: 100%;
        height: 100%;
        background-position: center center;
        background-image: url(../../assets/404imgs/bg.jpg);
        /*cover  此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小*/
        background-size: cover;
        .panel-cover--overlay{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
            display: block;
            background-color: rgba(60, 91, 147, 0.6);
            background-image: linear-gradient(140deg,rgba(61, 66, 96, 0.6) 20%, rgba(21, 23, 34, 0.8))
        }


        .wrapper {
            position: relative;
            z-index: 900;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            max-width: 625px;
            text-align: center;
            color: #fff;

            .panel-cover__logo {
                width: 25%;
                border: 3px solid #FFF;
                border-radius: 50%;
                box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
                transition: all .5s;

                &:hover {
                    border: 3px solid #5ba4e5;
                    transition: all .5s;
                    transform: rotate(360deg);

                }
            }
            .panel-title{
                margin: 0 0 15px 0;
                color: #FFF;
                letter-spacing: 4px;
                font-size: 2em;
                line-height: 1.2em;
                font-weight: 100;
            }
            .panel-cover__divider{
                border: none;
                margin: 20px auto;
                width: 50%;
                border-top: 1px solid rgba(255, 255, 255, 0.14);
            }
            .panel-cover__divider--secondary{
                width: 15%;
            }

            .panel-cover__description{
                margin: 0 30px;
                font-weight: 400;
            }

            .navigation-wrapper{
                .cover-navigation{
                    margin-top: 42px;
                    .navigation{
                        position: relative;
                        display: inline-block;
                        margin: 0;
                        list-style-type: none;
                        .navigation__item{
                            display: inline-block;
                            margin: 5px 1px 0 0;
                            line-height: 1em;
                            .link{
                                position: relative;
                                display: block;
                                border: 1px solid  #FFF;
                                color: #FFF;
                                opacity: .8;
                                padding: 10px 20px;
                                border-radius: 20px;
                                text-shadow: none;
                                letter-spacing: 1px;
                                font-weight: bold;
                                font-size: .9em;
                                -webkit-font-smoothing: antialiased;
                                &:hover{
                                    border-color: rgba(255, 255, 255, 0.3);
                                    background: rgba(255, 255, 255, 0.3);
                                    color: #FFF;
                                    opacity: 1;
                                    transition: all .3s;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
