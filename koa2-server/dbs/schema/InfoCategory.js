/**
 * Created by yanyue on 2020/7/1 22:02
 * 信息分类实体
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require("uuid");

const InfoCategorySchema = new Schema({
    //信息分类Id
    infoCategoryId: {
        type: String,
        default: ()=>uuid.v4(),
        required: true
    },
    //信息分类名称
    infoCategoryName: {
        type: String,
        unique: true,
        required: true
    },
    // 分类界别
    level: {
        type: Number,
        required: true
    },
    //父级id
    parentId: {
        type: String,
        default: ""
    }
});

module.exports = InfoCategory = mongoose.model('infoCategory', InfoCategorySchema);
