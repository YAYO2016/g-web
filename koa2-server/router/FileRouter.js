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

//文件下载 -- 普通下载
router.get('/downloadFile', async (ctx, next) => {
    try {
        let filename = ctx.query.filename;
        let originName = ctx.query.originName;
        let filePath = `${FileUploadPath}/${filename}`;
        // 判断文件是否存在
        if (!fs.existsSync(filePath)) {
            ctx.status = 404;
            return
        }
        let result = fs.createReadStream(filePath);
        //在response的headers里面返回文件名
        ctx.set('Content-disposition', 'attachment;filename=' + originName);
        ctx.body = result; // koa做了针对stream类型的处理，详情可以看之前的koa篇
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;
