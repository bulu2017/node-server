// 构建用户模型数据
const mongoose = require("mongoose");
//
const User = new mongoose.Schema({
    name: {
        type: String, //类型
        require: [true, '请填写用户名'], //是否必须填写
        // unique: true, //是否唯一
        trim: true, //去掉空格
        maxlength: [20, '用户名不能超过20个字'] //最大长度
    },
    mobile: {
        type: String,
        match: [/^[1][0-9][0-9]{9}$/, '请填写有效的手机号'],
    },
    email: {
        type: String,
        match: [/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, '请填写正确的邮箱地址'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// 将模型数据暴露出去
module.exports = mongoose.model('UserModel', User)