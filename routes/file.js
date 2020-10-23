let express = require('express');
let router = express.Router();
// 文件上传
const config = require('../config')
let fs = require('fs');
let multer = require('multer');
const moment = require('moment');
const { route } = require('.');
const { IsEmpty } = require('../utils/verify');
// 定义上传目录
// const _fileName = moment(new Date()).format('YYYY-MM-DD');
let upload = multer({ dest: config.fs.uploadPath }).single('filePath');
let multifileUpload = multer({ dest: config.fs.uploadPath }).array('filePath', config.fs.num);

let fileSuffix = (filename) => {
    if (IsEmpty(filename)) {
        return ''
    }
    let fileNameSplit = filename.split('.');
    if (fileNameSplit.length == 2) {
        return '.' + fileNameSplit[fileNameSplit.length - 1];
    } else {
        return '';
    }
}

// 定义单文件上传
router.post('/file/upload', upload, (req, resp) => {
    if (req.file.length === 0) {
        resp.status(200).json({ code: -1, msg: '文件不能为空！', data: {} })
    } else {
        // 执行文件上传
        let fileTemp = req.file;
        let fileInfo = {};
        // console.log(fileTemp);
        if (config.fs.saveOriginalName) {
            fs.renameSync(config.fs.uploadPath + fileTemp.filename, config.fs.uploadPath + fileTemp.originalname); //这里修改文件名字，比较随意。
        } else {
            fs.renameSync(config.fs.uploadPath + fileTemp.filename, config.fs.uploadPath + fileTemp.filename + fileSuffix(fileTemp.originalname)); //这里修改文件名字，比较随意。
        }
        // 获取文件信息
        fileInfo.mimetype = fileTemp.mimetype;
        fileInfo.originalname = fileTemp.originalname;
        fileInfo.size = fileTemp.size;
        fileInfo.path = fileTemp.path;

        // 设置响应类型及编码
        resp.set({
            'content-type': 'application/json; charset=utf-8'
        });
        let imgUrl = '' + fileTemp.originalname;
        resp.status(200).json({ code: 0, msg: '上传成功！', data: imgUrl })
    }
});

// 定义多文件上传
router.post('/multiFile/upload', multifileUpload, (req, resp) => {
    let files = req.files;
    if (files.length === 0) {
        resp.status(200).json({ code: -1, msg: '文件不能为空！', data: {} })
    } else {
        // 执行文件上传 
        let fileInfos = [];
        let fileArray = new Array();
        files.forEach((fileTemp, index) => {
            if (config.fs.saveOriginalName) {
                fs.renameSync(config.fs.uploadPath + fileTemp.filename, config.fs.uploadPath + fileTemp.originalname); //这里修改文件名字，比较随意。
            } else {
                fs.renameSync(config.fs.uploadPath + fileTemp.filename, config.fs.uploadPath + fileTemp.filename + fileSuffix(fileTemp.originalname)); //这里修改文件名字，比较随意。
            }
            fileInfos.push({
                mimetype: fileTemp.mimetype,
                originalname: fileTemp.originalname,
                size: fileTemp.size,
                path: fileTemp.path
            });
            fileArray.push(fileTemp.originalname);
        });
        // 设置响应类型及编码
        resp.set({
            'content-type': 'application/json; charset=utf-8'
        });
        resp.status(200).json({ code: 0, msg: '上传成功！', data: fileArray })
    }
});

module.exports = router;