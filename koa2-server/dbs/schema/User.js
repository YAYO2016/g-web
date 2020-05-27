/**
 * Created by yanyue on 2020/5/26 16:05
 * User用户表实体
 */
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
    email:String,
    //创建时间
    createDate: {type: Date, default: Date.now()},
    //最后登录时间
    lastLoginDate: {type: Date, default: Date.now()},
    //头像地址
    avatar: String
}, {
    collection: "user"  //避免创建的表名变为users
});


//发布模型
mongoose.model("User", userSchema);
