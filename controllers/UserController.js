// 数据库链接对象
var dbContext = require('../dbcontext/mysql');
/**
 * 获取用户信息
 */
GetList = (req, resp) => {
    var _sql = 'SELECT * FROM n_users';
    var _sqlArr = [];
    dbContext.sqlConnect(_sql, _sqlArr, (err, data) => {
        if (!err) {
            resp.json({ code: 0, msg: '查询成功', data: data })
        } else {
            console.log(err)
            resp.json({ code: 100, msg: '查询失败', data: null })
        }
    });
};
/**
 * 通过用户ID 查询用户信息
 */
GetById = (req, resp) => {
    let { id } = req.params;
    if (!id) {
        id = req.query.id;
    }
    var _sql = `SELECT * FROM n_users where id=?`;
    var _sqlArr = [id];
    dbContext.sqlConnect(_sql, _sqlArr, (err, data) => {
        if (!err) {
            resp.json({ code: 0, msg: '查询成功', data: data })
        } else {
            console.log(err)
            resp.json({ code: 100, msg: '查询失败', data: null })
        }
    });
};
/**
 * 创建用户
 */
Create = (req, resp) => {
    let { name } = req.params;

    var _sql = `SELECT * FROM n_users where id=?`;
    var _sqlArr = [id];
    dbContext.sqlConnect(_sql, _sqlArr, (err, data) => {
        if (!err) {
            resp.json({ code: 0, msg: '查询成功', data: data })
        } else {
            console.log(err)
            resp.json({ code: 100, msg: '查询失败', data: null })
        }
    });
};

module.exports = {
    GetList,
    GetById,
    Create
}