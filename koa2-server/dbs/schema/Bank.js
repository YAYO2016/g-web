/**
 * Created by yanyue on 2020/4/7 22:05
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankSchema = new Schema({
    //银行id
    bankId: {
        type: Number,
        required: true
    },
    //
    correspondentNo: {
        type: Number,
        required: true
    },
    //银行名称
    bankName: {
        type: String,
        required: true
    },
    //总行编号
    bankNo: {
        type: Number,
        required: true
    },
    //分行编号
    branchNo: {
        type: Number,
        required: true
    },
    ownerCounty: {
        type: String,
    }

});

module.exports = Bank = mongoose.model('bank', BankSchema);
