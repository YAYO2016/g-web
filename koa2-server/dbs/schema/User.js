/**
 * Created by yanyue on 2020/5/26 16:05
 * User用户表实体
 */
const moment = require("moment");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

//创建UserSchema
const userSchema = new Schema({
    //用户id
    userId: ObjectId,
    //用户名
    username: {
        unique: true,
        type: String,
    },
    //用户密码
    password: String,
    //email
    email: {
        unique: true,
        type: String,
    },
    //创建时间 -- 不能直接使用Date.now() mongodb默认的时间是格林威治时间，和当地时间存在时间差，使用moment去设置时间可以解决该问题
    createDate: {type: Date, default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')},
    //最后登录时间
    lastLoginDate: {type: Date, default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')},
    //头像地址
    avatar: String,
    //用户角色
    roles: String
}, {
    collection: "user"  //避免创建的表名变为users
});


//发布模型
mongoose.model("User", userSchema);
