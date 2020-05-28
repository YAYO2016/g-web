/**
 * Created by yanyue on 2020/5/26 16:02
 */
const Router = require("koa-router");
const mongoose = require("mongoose");
//使用jwt生成token
const jwt = require("jsonwebtoken");
const {PRIVATE_KEY, JWT_EXPIRED} = require("../utils/constant");
const jwtutil = require("../utils/jwt");

const router = new Router();


//用户注册/user/register
router.post("/register", async (ctx) => {
    //util.OtherFn.sleep(5000);
    const User = mongoose.model("User");
    let newUser = new User(ctx.request.body);
    await newUser.save().then(() => {
        ctx.body = {
            code: 200,
            message: "注册成功"
        }
    }).catch(error => {
        ctx.body = {
            code: 500,
            message: error.errmsg
        }
    })
});

//用户登录/user/login
router.post("/login", async (ctx) => {
    let {username, password} = ctx.request.body;

    const User = mongoose.model("User");
    await User.updateOne(
        {username}, //查询
        {lastLoginDate: new Date()}
    );
    await User.findOne({username: username}).exec().then(async result => {
        if (result) {
            //请求中的密码和查询到的用户中的密码进行比较
            if (result.password === password) {

                //生成token
                let token = jwt.sign(
                    {email: result.email},   //必须返回一个数据的unique数据，方便后面解析token后，查询到数据全部
                    PRIVATE_KEY,
                    //expiresIn过期时间
                    {expiresIn: JWT_EXPIRED}
                );

                ctx.body = {
                    code: 200,
                    //Bearer 必须添加，表明令牌类型
                    data: {token: 'Bearer ' + token},
                    message: "登录成功"
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: "密码错误"
                }
            }

        } else {
            ctx.body = {
                code: 500,
                message: "用户名不存在"
            }
        }
    }).catch(error => {
        ctx.body = {
            code: 500,
            message: error.errmsg
        }
    })
});


//用户忘记密码  更新密码
router.post("/forgetPassword", async (ctx) => {
    let {email, password} = ctx.request.body;
    const User = mongoose.model("User");
    await User.updateOne(
        {email}, //查询
        {password},
    ).then(result => {
        if (result) {
            ctx.body = {
                code: 200,
                message: "修改密码成功"
            }
        } else {
            ctx.body = {
                code: 500,
                message: "修改密码失败"
            }
        }
    }).catch(error => {
        ctx.body = {
            code: 500,
            message: error.errmsg
        }
    })
});

//查询单个用户信息
router.post("/getUserInfo", async (ctx) => {
    //解析js中的token
    //let {token} = ctx.request.body;
    //if (token.indexOf("Bearer") === 0) {
    //    token = token.replace("Bearer ", "");
    //}
    //let result = null;
    //jsonwebtoken解析请求返回的token
    //await jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    //    if (err) {
    //        ctx.body = {
    //            code: 500,
    //            message: "令牌失效"
    //        }
    //    } else {
    //        result = decoded;
    //    }
    //});
    const User = mongoose.model("User");
    let decode = jwtutil.decode(ctx.request);
    console.log(decode);
    if (decode && decode.email) {
        await User.findOne({email: decode.email}).then(result => {
            if (result) {
                ctx.body = {
                    code: 200,
                    message: "查询成功",
                    data: result
                }
            } else {
                ctx.body = {
                    code: 500,
                    message: "查无数据"
                }
            }
        }).catch(error => {
            ctx.body = {
                code: 500,
                message: "查询异常"
            }
        })
    } else {
        ctx.body = {
            code: 500,
            message: "用户信息查询失败",
        };
    }
});

//获取所有用户的信息
router.post('/getAllUsers', async (ctx) => {
    let {username, pageNum, pageSize} = ctx.request.body;
    const User = mongoose.model("User");
    let total = 0;
    if (username) {
        let allUser = await User.find({username});
        total = allUser.length;
    } else {
        let allUser = await User.find();
        total = allUser.length;
    }
    await User.find(username ? {username} : {}).limit(pageSize).skip((pageNum - 1) * pageSize).then(users => {
        if (users) {
            let result = {
                list: users,
                pageInfo: {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    total: total
                }
            };
            ctx.body = {
                code: 200,
                data: result,
                message: "查询成功"
            };
        } else {
            ctx.body = {
                code: 500,
                message: "查询用户信息失败",
            };
        }
    })
});

module.exports = router;

