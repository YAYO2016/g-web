/**
 * Created by yanyue on 2020/7/1 22:04
 */
const Router = require("koa-router");
const mongoose = require("mongoose");
const InfoCategory = require("../dbs/schema/InfoCategory");
const router = new Router();
const util = require("../utils/util");

router.post("/addCategory", async (ctx) => {
    let body = ctx.request.body;
    let infoCategory = new InfoCategory(body);
    await infoCategory.save().then(() => {
        ctx.body = {
            code: 200,
            message: "新增成功"
        }
    }).catch(error => {
        ctx.body = {
            code: 500,
            message: error.errmsg
        }
    })
});

router.get("/getAllCategory", async (ctx) => {
    let categorys = await InfoCategory.find();
    let categorysTemp = categorys.map(item => {
        return {
            infoCategoryName: item.infoCategoryName,
            level: item.level,
            infoCategoryId: item.infoCategoryId,
            parentId: item.parentId
        }
    });
    //需要去掉_id,这个对象形式的_id,不然translateDataToTree将无法执行，出现问题
    console.log(categorysTemp);
    if (categorysTemp) {
        let result = {
            list: util.ArrayFn.translateDataToTree(categorysTemp, 'infoCategoryId', 'parentId', 'children')
        };
        ctx.body = {
            code: 200,
            message: "查询成功",
            data: result
        };
    } else {
        ctx.body = {
            code: 500,
            message: "查询失败"
        }
    }
});


module.exports = router;
