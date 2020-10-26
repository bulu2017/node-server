// 数据库链接对象
let dbFactory = require('../dbcontext/DBFactory').createFactory();
let { IsEmpty, CheckMobile } = require('../utils/verify');
const formidable = require('formidable');
const moment = require('moment');

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