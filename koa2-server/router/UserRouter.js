/**
 * Created by yanyue on 2020/5/26 16:02
 */
const Router = require("koa-router");
const mongoose = require("mongoose");

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
    await User.findOne({username: username}).exec().then(async result => {
        if (result) {
            //请求中的密码和查询到的用户中的密码进行比较
            if (result.password === password) {
                ctx.body = {
                    code: 200,
                    data: {token: 'token'},
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

module.exports = router;

