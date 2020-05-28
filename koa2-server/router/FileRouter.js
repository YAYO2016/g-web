/**
 * Created by yanyue on 2020/5/28 19:43
 * 上传文件的模块
 */
const jwtutil = require("../utils/jwt");
const Router = require("koa-router");
const mongoose = require("mongoose");
const router = new Router();
const fs = require("fs");
const path = require("path");
const {FileUploadPath} = require("../utils/constant");
const util = require("../utils/util");

router.post('/uploadfile', async (ctx, next) => {
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
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
        data: {...file, name: `${randomFileName}.${fileSuffix}`}
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

module.exports = router;
