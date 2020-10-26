const mysql = require('mysql');
const { IsEmpty } = require('../utils/verify');

module.exports = {
    config: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'node_db',
        multipleStatements: true
    },
    // 链接数据库，使用mysql 的链接池链接方式
    Execute: function(sql, sqlArr, callback) {
        var pool = mysql.createPool(this.config);
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('链接失败！')
                return
            }
            // 事件驱动回调
            conn.query(sql, sqlArr, callback);
            //释放链接
            conn.release();
        });
    },
    //promise 同步查询
    SyncExecute: function(sql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config);
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err)
                } else {
                    // 事件驱动回调
                    conn.query(sql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(data)
                        }
                    });
                    //释放链接
                    conn.release();
                }
            });
        }).catch(err => {
            console.log(err)
        });
    },
    /**
     *  查询所有数据字段
     * @tableName 表名称
     * @callBack 执行回调函数
     */
    selectAll: function(tableName, callback) {
        // console.log(tableName)
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }
        let _sql = "select * from " + tableName + " ";
        // console.log(_sql)
        this.Execute(_sql, [], callback);
    },
    /**
     * 带参数查询
     * @tableName 表名称
     * @topNumber 前topNumber条
     * @params 查询参数对象（可为[]）
     * @whereSql 查询条件 例如 "whre id = ?"
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
        callback()
    },
    /**
     * 修改数据
     * @tableName 表名称，
     * @updateObj 修改内容（必填）
     * @whereObj 修改内容（必填）
     * @callBack 执行回调函数
     */
    update: function(tableName, updateObj, whereObj, callBack) {
        callback()
    },
    /**
     * 删除操作
     * @tableName 表名称
     * @params 删除条件参数
     * @whereSql 删除条件
     * @callBack 执行回调函数
     */
    del: function(tableName, params, whereSql, callBack) {
        callback()
    }
}