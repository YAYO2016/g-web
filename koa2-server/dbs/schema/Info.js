/**
 * Created by yanyue on 2020/7/4 18:33
 * 信息实体
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require("uuid");
const moment = require("moment");

const InfoSchema = new Schema({
    //信息Id
    infoId: {
        type: String,
        default: () => uuid.v4(),
        required: true
    },
    //信息标题
    title: {
        type: String,
        required: true
    },
    // 信息内容
    content: {
        type: String,
        required: true
    },
    //信息类别名称
    infoCategoryName: {
        type: String,
        required: true
    },
    //信息类别id
    infoCategoryId: {
        type: String,
        required: true
    },
    createDate: {type: Date, default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')},
    creatorName: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    //缩略图
    thumbPic: {
        type: String,
    }
}, {
    collection: "info"
});

module.exports = Info = mongoose.model('info', InfoSchema);
