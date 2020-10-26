/**
 * PostgreSQL
 */
var pg_db = require('pg');
const {
    param
} = require('../routes');
const { IsEmpty } = require('../utils/verify');

module.exports = {
    config: {
        user: 'root',
        password: '123456',
        host: '127.0.0.1',
        port: '5432',
        database: 'node_db',
        poolSize: 5,
        poolIdleTimeout: 30000,
        reapIntervalMillis: 10000
    },
    Execute: function(sql, params, callback) {
        let pgPool = new pg_db.Pool(this.config);
        pgPool.connect((err, client, done) => {
            if (err) {
                throw ('postGreSql数据库链接失败！')
            }
            client.query(sql, params, (_error, result) => {
                done();
                console.log(_error)
                if (_error) {
                    throw ('postGreSql执行脚本失败！')
                }
                callback(_error, result.rows);
            })
        });
    },
    /**
     *  查询所有数据字段
     * @tableName 表名称
     * @callBack 执行回调函数
     */
    selectAll: function(tableName, callback) {
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }
        let _sql = "select * from " + tableName + " ";
        console.log(_sql)
        this.Execute(_sql, [], callback);
    },
    /**
     * 带参数查询
     * @tableName 表名称
     * @topNumber 前topNumber条
     * @params 查询参数对象（可为""，为""表示不加任何参数，如果此项为""，则whereSql必须也为""）
     * @whereSql 查询条件
     * @orderSql 排序（可为""，为""表示不排序）
     * @callBack 执行回调函数
     */
    select: function(tableName, topNumber, params, whereSql, orderSql, callBack) {
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }
        if (IsEmpty(params)) {
            throw ('无效的查询参数！');
        }
        let _sql = 'select * from ' + tableName + ' ';
        if (!IsEmpty(topNumber)) {
            _sql = 'select top(' + topNumber + ') * from ' + tableName + ' ';
        }
        if (!IsEmpty(whereSql)) {
            _sql += whereSql + ' ';
        }
        if (!IsEmpty(orderSql)) {
            _sql += orderSql + ' ';
        }
        this.Execute(_sql, params, callBack);
    },
    /**
     * 添加数据
     * @tableName 表名称
     * @fieldObj 添加对象（必填）
     * @callBack 执行回调函数
     */
    add: function(tableName, fieldObj, callback) {

    },
    /**
     * 修改数据
     * @tableName 表名称，
     * @updateObj 修改内容（必填）
     * @whereObj 修改内容（必填）
     * @callBack 执行回调函数
     */
    update: function(tableName, updateObj, whereObj, callBack) {},
    /**
     * 删除操作
     * @tableName 表名称
     * @params 删除条件参数
     * @whereSql 删除条件
     * @callBack 执行回调函数
     */
    del: function(tableName, params, whereSql, callBack) {}
}