/**
 * Created by yanyue on 2020/5/26 15:58
 */
//引入koa2
const Koa = require("koa");
//生成应用
const app = new Koa();
//引入koa-router组件
const Router = require("koa-router");
//生成router应用
const router = new Router();


//引入koa-bodyparser来解析post请求的body数据，也就是将post请求参数封装成对象
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());


//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());


app.use(async (ctx) => {
    ctx.body = "<h1>Hello koa2</h1>"
});

//监听一个端口
app.listen(7005, () => {
    console.log("server started in 7005");
});
