// 数据库链接对象
let dbFactory = require('../dbcontext/DBFactory').createFactory();
let { IsEmpty, CheckMobile } = require('../utils/verify');
const formidable = require('formidable');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * 授权登录
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.LoginAuth = (req, resp, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let { username, password } = fields;
        if (IsEmpty(username)) {
            resp.status(200).json({ code: -1, msg: '登录账号不能为空', data: {} })
        }
        if (IsEmpty(password)) {
            resp.status(200).json({ code: -1, msg: '登录密码不能为空', data: {} })
        }
        const _time = Math.floor(Date.now() / 1000); //秒

        let _payload = {
            // iss: 'BuluJWT', // 该JWT的签发者
            // sub: 'bulu', //主题,该JWT所面向的用户
            // aud: '', //受众,接收该JWT的一方
            // iat: _time, //签发时间,在什么时候签发的
            // exp: _time + (60 * 60), // 一小时有效,什么时候过期，这里是一个Unix时间戳(秒)
            // nbf: _time, //生效时间
            name: username
        };
        let _options = {
            expiresIn: _time + (60 * 60)
        };
        //var _privateKey = fs.readFileSync('../public/keys/private.key');
        const _privateKey = config.jwt.secret;
        jwt.sign(_payload, _privateKey, _options, (err, token) => {
            if (err) {
                resp.status(200).json({ code: -1, msg: err.message, data: '' });
            } else {
                resp.status(200).json({ code: 0, msg: '登录成功', data: ('Bearer ' + token) });
            }
        });
    });
};
/**
 * 获取用户信息
 */
exports.GetList = (req, resp, next) => {
    if (req.query.id) {
        this.GetById(req, resp, next);
    } else {
        dbFactory.selectAll('n_users', (err, data) => {
            if (!err) {
                resp.status(200).json({ code: 0, msg: '查询成功', data: data })
            } else {
                resp.status(200).json({ code: 100, msg: '查询失败', data: null })
            }
        });
        // var _sql = 'SELECT * FROM n_users';
        // var _sqlArr = [];
        // dbFactory.Execute(_sql, _sqlArr, (err, data) => {
        //     if (!err) {
        //         resp.status(200).json({ code: 0, msg: '查询成功', data: data })
        //     } else {
        //         console.log(err)
        //         resp.status(200).json({ code: 100, msg: '查询失败', data: null })
        //     }
        // });
    }
};
/**
 * 通过用户ID 查询用户信息
 */
exports.GetById = (req, resp, next) => {
    let { id } = req.params;
    if (!id) {
        id = req.query.id;
    }
    dbFactory.select('n_users', '', [id], 'where id=?', 'order by createdAt', (err, data) => {
        if (!err) {
            resp.status(200).json({ code: 0, msg: '查询成功', data: data })
        } else {
            console.log(err)
            resp.status(200).json({ code: 100, msg: '查询失败', data: null })
        }
    });
    // var _sql = `SELECT * FROM n_users where id=?`;
    // var _sqlArr = [id];
    // dbFactory.Execute(_sql, _sqlArr, (err, data) => {
    //     if (!err) {
    //         resp.status(200).json({ code: 0, msg: '查询成功', data: data })
    //     } else {
    //         console.log(err)
    //         resp.status(200).json({ code: 100, msg: '查询失败', data: null })
    //     }
    // });
};
/**
 * 创建用户
 */
exports.CreateUser = (req, resp, next) => {
    // console.log(JSON.stringify(req.body));
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let { name, mobile } = fields;

        if (IsEmpty(name)) {
            resp.status(200).json({ code: -1, msg: '用户名不能为空', data: {} })
        }
        if (!CheckMobile(mobile)) {
            resp.status(200).json({ code: -1, msg: '无效的手机号码', data: {} })
        }

        let _sql = `insert into n_users(name,mobile,createdAt) value(?,?,?)`;
        let _sqlArr = [name, mobile, moment(new Date()).format('YYYY-MM-DD HH:mm:ss')];
        dbFactory.Execute(_sql, _sqlArr, (err, data) => {
            if (!err) {
                resp.status(200).json({ code: 0, msg: '创建成功', data: data })
            } else {
                // console.log(err.code)
                resp.status(200).json({ code: 100, msg: err.message, data: null })
            }
        });
    });
};