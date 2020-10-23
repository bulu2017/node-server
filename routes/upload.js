let express = require('express');
let router = express.Router();
// 文件上传
let fs = require('fs');
let multer = require('multer');
let moment = require('moment');
let path = require('path');
const mkdirp = require('mkdirp');
const snowflake = require('node-snowflake').Snowflake;
// 全局参数
const config = require('../config');
const { IsEmpty, EmptyDefault } = require('../utils/verify');
/**
 * 封装图片上传
 */
const _storage = multer.diskStorage({
    // 配置上传的目录
    destination: async(req, file, callback) => {
        // 1. 获取当前日期 20200703
        let day = moment(new Date()).format('YYYY-MM-DD') + '/';
        // 2. 系统配置文件默认存放地址
        let _uploadPath = './public/uploads/';
        if (!IsEmpty(config.fs.uploadPath)) {
            _uploadPath = config.fs.uploadPath;
        }
        // 2.1. 目录拼接
        let dir = path.join(_uploadPath, day);
        // 3. 按照日期生成图片存储目录
        await mkdirp(dir); // mkdirp是一个异步方法
        callback(null, dir);
    },
    // 修改上传后的文件名
    filename: function(req, file, callback) {
        // 获取上传文件的后缀名
        let extname = path.extname(file.originalname);
        let _fileUrl = '';
        if (EmptyDefault(config.fs.saveOriginalName, false)) {
            _fileUrl = file.originalname;
        } else {
            _fileUrl = moment(new Date()).format('YYYYMMDD0000') + snowflake.nextId() + extname;
        }
        callback(null, _fileUrl);
    }
});

let upload = multer({ storage: _storage }).single('filePath');
let multifileUpload = multer({ storage: _storage }).array('filePath', config.fs.num);

// 定义单文件上传
router.post('/file/upload', upload, (req, resp) => {
    if (req.file.length === 0) {
        resp.status(200).json({ code: -1, msg: '文件不能为空！', data: {} });
    } else {
        // 执行文件上传
        let fileTemp = req.file;
        // 设置响应类型及编码
        resp.set({
            'content-type': 'application/json; charset=utf-8'
        });
        let imgUrl = '' + fileTemp.filename;
        resp.status(200).json({ code: 0, msg: '上传成功！', data: imgUrl });
    }
});

// 定义多文件上传
router.post('/multiFile/upload', multifileUpload, (req, resp) => {
    let files = req.files;
    if (files.length === 0) {
        resp.status(200).json({ code: -1, msg: '文件不能为空！', data: {} });
    } else {
        // 执行文件上传 
        let fileArray = new Array();
        files.forEach((fileTemp, index) => {
            fileArray.push(fileTemp.filename);
        });
        // 设置响应类型及编码
        resp.set({
            'content-type': 'application/json; charset=utf-8'
        });
        resp.status(200).json({ code: 0, msg: '上传成功！', data: fileArray });
    }
});

module.exports = router;