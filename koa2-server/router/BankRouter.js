/**
 * Created by yanyue on 2020/4/5 19:05
 * 银行接口
 */
const Router = require("koa-router");
const mongoose = require("mongoose");
const Bank = require("../dbs/schema/Bank");
const router = new Router();

router.post("/getBanks", async (ctx) => {
    let body = ctx.request.body;
    let {bankName, pageNum, pageSize} = body;
    let banks = await Bank.find(bankName ? {bankName} : {}).sort("bankId").skip((pageNum - 1) * pageSize).limit(pageSize);
    let countTotal = await Bank.find(bankName ? {bankName} : {}).countDocuments();

    if (banks) {
        let result = {
            list: banks,
            pageInfo: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: countTotal
            }
        };
        ctx.body = {
            code: 200,
            message: "查询成功",
            data:result
        };
    } else {
        ctx.body = {
            code: 500,
            message: "查询失败"
        }
    }
});

router.post("/getBankInfo", async (ctx) => {
    let body = ctx.request.body;
    let {bankName, pageNum, pageSize} = body;
    console.log(bankName);
    let banks = await Bank.find(bankName ? {bankName: {$regex: `${bankName}`}} : {}).sort("bankId").skip((pageNum - 1) * pageSize).limit(pageSize);

    if (banks) {
        //new Result(banks, '查询成功').success(res);
        ctx.body = {
            code: 200,
            message: "查询成功",
            data:banks
        };
    } else {
        //new Result('查询失败').fail(res);
        ctx.body = {
            code: 500,
            message: "查询失败"
        }
    }

});

module.exports = router;
