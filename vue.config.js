/**
 * Created by yanyue on 2019-09-18 17:04
 */

const path = require('path');
const webpack = require('webpack');
const debug = process.env.NODE_ENV !== 'production';

function resolve(dir) {
    return path.join(__dirname, '.', dir);
}

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/", // 输出文件目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map'
        } else { // 生产环境配置

        }
        Object.assign(config, { // 开发生产共同配置
            resolve: {
                extensions: [".js", ".vue", ".json"],
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@components': path.resolve(__dirname, './src/components'),
                    //修改项目中vue的指向文件，让项目中使用vue的地方指向dist下的vue文件，不使用默认的vue.runtime.common.js
                    'vue': 'vue/dist/vue.js',
                }
            }
        })
    },
    chainWebpack: config => { // webpack链接API，用于生成和修改webapck配置，https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
        if (debug) {
            // 本地开发配置
        } else {
            // 生产开发配置
        }

        //配置svg-sprite-loader，能批量解析svg文件
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
    },
    css: {
        loaderOptions: {
            // 安装sass-resources-loader，然后配置这里，可以全局使用scss的变量和方法，
            // 无需每个vue文件中都要单独引入样式，也无需在main.js中映入
            // npm i sass-resources-loader -D
            // ,不然的话只能使用样式，而无法使用方法和变量
            sass: {
                prependData: `@import "@/common/style/common.scss";`
            }
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    pluginOptions: { // 第三方插件配置
    },
    pwa: { // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    },
    devServer: {
        open: false,   //每次运行自动打开浏览器
        host: '0.0.0.0',
        port: 3000,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            [process.env.VUE_APP_API_URL]: {
                //target: 'http://localhost:7005/',
                target: 'http://121.196.183.67:7005/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    ["^" + process.env.VUE_APP_API_URL]: ""
                }
            }
        },
        before: app => {
        }
    }
};
