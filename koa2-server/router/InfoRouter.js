/**
 * Created by yanyue on 2020/7/1 22:04
 */
const Router = require("koa-router");
const mongoose = require("mongoose");
const InfoCategory = require("../dbs/schema/InfoCategory");
const Info = require("../dbs/schema/Info");
const router = new Router();
const util = require("../utils/util");

// 新增和编辑信息类别
router.post("/addCategory", async (ctx) => {
    let body = ctx.request.body;
    //根据返回的数据中infoCategoryId是否有效，判断数据是新增还是编辑
    if (body.infoCategoryId) {
        //编辑
        await InfoCategory.updateOne(
            {infoCategoryId: body.infoCategoryId}, //查询
            {infoCategoryName: body.infoCategoryName},
        ).then(result => {
            if (result) {
                ctx.body = {
                    code: 200,
                    data: result,
                    message: "编辑信息类别成功",
                };
            } else {
                ctx.body = {
                    code: 500,
                    message: "编辑信息类别失败",
                };
            }
        })
    } else {
        //新增
        delete body.infoCategoryId;
        let infoCategory = new InfoCategory(body);
        await infoCategory.save().then((result) => {
            ctx.body = {
                code: 200,
                data: result,
                message: "新增信息类别成功"
            }
        }).catch(error => {
            console.log(error);
            ctx.body = {
                code: 500,
                message: error.errmsg
            }
        })
    }
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

//删除信息类别
router.post("/deleteCategory", async (ctx) => {
    let body = ctx.request.body;
    let result = await InfoCategory.remove({"infoCategoryId": body.infoCategoryId});
    if (result) {
        ctx.body = {
            code: 200,
            message: "删除成功",
            data: result
        };
    } else {
        ctx.body = {
            code: 500,
            message: "删除失败"
        }
    }
});


// 新增和编辑信息
router.post("/addOrEditInfo", async (ctx) => {
    let body = ctx.request.body;
    //根据返回的数据中infoId是否有效，判断数据是新增还是编辑
    if (body.infoId) {
        //编辑
        await Info.updateOne(
            {infoId: body.infoId}, //查询
            {title: body.title, content: body.content},
        ).then(result => {
            if (result) {
                ctx.body = {
                    code: 200,
                    data: result,
                    message: "编辑信息类别成功",
                };
            } else {
                ctx.body = {
                    code: 500,
                    message: "编辑信息类别失败",
                };
            }
        })
    } else {
        //新增
        delete body.infoId;
        let info = new Info(body);
        await info.save().then((result) => {
            ctx.body = {
                code: 200,
                data: result,
                message: "新增信息成功"
            }
        }).catch(error => {
            console.log(error);
            ctx.body = {
                code: 500,
                message: error
            }
        })
    }
});

//获取所有的信息
router.post("/getAllInfo", async (ctx) => {
    let body = ctx.request.body;
    let {startDate, endDate, infoCategoryId, pageNum, pageSize} = body;
    let infos = await Info.find(
        {
            "$and":
                [startDate ? {"createDate": {"$gt": startDate}} : {},
                    endDate ? {"createDate": {"$lt": endDate}} : {},
                    infoCategoryId === '' ? {} : {
                        infoCategoryId: {
                            $regex: infoCategoryId,  //正则匹配，模糊查询
                            $options: 'i'  //忽略大小写
                        }
                    }
                ]
        }
    ).skip((pageNum - 1) * pageSize).limit(pageSize);
    let countTotal = await Info.find({}).countDocuments();
    //需要去掉_id,这个对象形式的_id,不然translateDataToTree将无法执行，出现问题
    if (infos) {
        let result = {
            list: infos,
            pageInfo: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: countTotal
            }
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
