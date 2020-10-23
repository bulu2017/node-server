// 构建用户模型数据
const mongoose = require("mongoose");

const Result = new mongoose.Schema({
    code: {
        type: Number, // 执行状态 0：执行成功，其他未错误
        default: 0
    },
    msg: {
        type: String,
        default: 'success'
    },
    data: {
        type: Object,
        default: {}
    },
    timeStamp: {
        type: Number,
        default: new Date().getTime()
    }
});
// 将模型数据暴露出去
module.exports = mongoose.model('ResultModel', Result)