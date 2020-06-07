/**
 * Created by yanyue on 2020/5/28 19:43
 * 上传文件的模块
 */
const jwtutil = require("../utils/jwt");
const Router = require("koa-router");
const mongoose = require("mongoose");
const router = new Router();
const send = require('koa-send');
const fs = require("fs");
const path = require("path");
const {FileUploadPath} = require("../utils/constant");
const util = require("../utils/util");
const static = require('koa-static')

router.post('/uploadfile', async (ctx, next) => {
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    //获取文件的原始名称
    let fileName = file.name;
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    //let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
    //生成文件唯一名
    let randomFileName = util.OtherFn.uuid(16, 16);
    //获取文件后缀
    let fileSuffix = file.name.split('.').splice(-1);
    let filePath = `${FileUploadPath}` + `/${randomFileName}.${fileSuffix}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    await reader.pipe(upStream);

    //获取当前登录用户
    //const User = mongoose.model("User");
    //let decode = jwtutil.decode(ctx.request);
    //let user = null;
    //if (decode && decode.email) {
    //    user = await User.findOne({email: decode.email})
    //}
    ////修改用户的头像图片名
    //await User.updateOne(
    //    {email: user.email}, //查询
    //    {avatar: `${randomFileName}.${fileSuffix}`}
    //);
    return ctx.body = {
        code: 200,
        message: "上传成功",
        data: {...file, name: `${randomFileName}.${fileSuffix}`, fileName, uploadTime: new Date()}
    };
});

router.post('/uploadfiles', async (ctx, next) => {
    // 上传多个文件
    const files = ctx.request.files.file; // 获取上传文件
    for (let file of files) {
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        // 获取上传文件扩展名
        //let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
        let filePath = `${FileUploadPath}` + `/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    }
    return ctx.body = "上传成功！";
});

//文件下载（分段下载）
router.get('/downloadFile', async (ctx, next) => {
    try {
        const filename = ctx.query.filename;
        const filePath = `D:\\YAYO-WEB\\upload\\${filename}`;
        console.log(filePath);
        //ctx.attachment(filePath);
        //await send(ctx, filePath);
        // 判断文件是否存在
        if (!fs.existsSync(filePath)) {
            ctx.status = 404;
            return
        }
        //// 1、404检查
        //try {
        //    fs.accessSync(filePath);
        //} catch (e) {
        //    return (ctx.response.status = 404);
        //}
        ////ctx.set('content-encoding', 'gzip');
        //const method = ctx.request.method;
        //const { size } = fs.statSync(filePath);
        //// 2、响应head请求，返回文件大小
        //if ("HEAD" == method) {
        //    return ctx.set("Content-Length", size);
        //}
        //const range = ctx.headers["range"];
        //if (!range) {
        //    //这里如果客户端不是分段请求就返回整个文件
        //    ctx.body = fs.createReadStream(filePath);
        //    return ctx.set("Accept-Ranges", "bytes");
        //} else {
        //    const { start, end } = getRange(range);
        //    // 4、检查请求范围
        //    if (start >= size) {
        //        ctx.response.status = 416;
        //        return ctx.set("Content-Range", `bytes */${size}`);
        //    }
        //    // 5、206分部分响应
        //    ctx.response.status = 206;
        //    ctx.set("Accept-Ranges", "bytes");
        //    ctx.set("Content-Range", `bytes ${start}-${end ? end : size - 1}/${size}`);
        //    ctx.body = fs.createReadStream(filePath, { start, end });
        //}
        let result = fs.createReadStream(filePath);
        ctx.body = result; // koa做了针对stream类型的处理，详情可以看之前的koa篇
    } catch (err) {
        console.log(err);
    }
});

function getRange(range) {
    const match = /bytes=([0-9]*)-([0-9]*)/.exec(range);
    const requestRange = {};
    if (match) {
        if (match[1]) requestRange.start = Number(match[1]);
        if (match[2]) requestRange.end = Number(match[2]);
    }
    return requestRange;
}
module.exports = router;
