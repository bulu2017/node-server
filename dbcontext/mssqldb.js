const mssql_db = require('mssql');
const {
    param
} = require('../routes');
const {
    IsEmpty
} = require('../utils/verify');

module.exports = {
    config: {
        user: 'sa', // SQL Server 的登录名
        password: 'sa', // SQL Server的登录密码
        server: 'localhost', // SQL Server的地址
        port: '1433', // 端口号，默认为1433
        // domain:'',// 设置domain后，可通过domain连接数据库
        database: '...', // 数据库名称
        connectionTimeout: 15000, // 连接timeout，单位ms 默认 15000
        requestTimeout: 15000, // 请求timeout，单位ms默认15000
        parseJSON: true, // 将json数据集转化成json obj
        pool: {
            min: 0, // 连接池最小连接数，默认0
            max: 10, //连接池最大连接数，默认10
            idleTimeoutMillis: 30000 //设置关闭未使用连接的时间，单位ms默认30000
        },
        options: {
            encrypt: true //使用windows azure，需要设置次配置。
        }
    },
    /**
     * 执行数据库操作
     */
    Execute: function(sql, sqlParams, callback) {
        new mssql_db.ConnectionPool(this.config)
            .connect()
            .then(pool => {
                let ps = new mssql_db.PreparedStatement(pool);
                // 参数遍历
                if (!IsEmpty(sqlParams)) {
                    for (var index in sqlParams) {
                        if (typeof sqlParams[index] === "number") {
                            ps.input(index, mssql_db.Int)
                        } else if (typeof sqlParams[index] === "string") {
                            ps.input(index, mssql_db.NVarChar)
                        } else if (typeof sqlParams[index] === "object") {
                            ps.input(index, mssql.DateTime);
                        }
                    };
                }
                // sql 准备
                ps.prepare(sql, error => {
                    if (error) {
                        throw (error);
                    }
                    // 执行sql
                    ps.execute(sqlParams, (err, result) => {
                        if (err) {
                            throw (err);
                        }
                        callback(_error, result);
                        ps.unprepare(_error => {
                            if (_error) {
                                throw (_error);
                            }
                        })
                    });
                })
            })
            .catch(error => {
                console.error(error);
                throw ('sqlserver链接或操作异常！');
            });
    },
    /**
     * 查询所有数据字段
     */
    selectAll: function(tableName, callback) {
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }

        let _sql = "select * from " + tableName + " ";
        this.Execute(_sql, {}, callback);
    },
    /**
     * 带参数查询
     * @tableName 表名称，
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
        console.log(_sql)
        this.Execute(_sql, params, callBack);
    },
    /**
     * 添加数据
     * @tableName 表名称，
     * @fieldObj 添加对象（必填）
     * @callBack 执行回调函数
     */
    add: function(tableName, fieldObj, callback) {
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }
        if (IsEmpty(fieldObj)) {
            throw ('无效的存储对象！');
        }
        let _sql = 'insert into ' + tableName + '(';
        // 参数遍历
        let _sqlv = '';
        for (var index in fieldObj) {
            _sql += index + ",";
            _sqlv += "@" + index + ",";
        };
        _sql = _sql.substr(0, _sql.length - 1) + ") output inserted.* values(";
        _sql += _sqlv.substr(0, _sqlv.length - 1) + ') ';

        this.Execute(_sql, fieldObj, callback);
    },
    /**
     * 修改数据
     * @tableName 表名称，
     * @updateObj 修改内容（必填）
     * @whereObj 修改内容（必填）
     * @callBack 执行回调函数
     */
    update: function(tableName, updateObj, whereObj, callBack) {
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }
        if (IsEmpty(updateObj)) {
            throw ('无效的修改对象！');
        }
        if (IsEmpty(whereObj)) {
            throw ('无效的查询条件');
        }
        let _sql = 'update ' + tableName + ' set ';
        for (var index in updateObj) {
            _sql += index + "=@" + index + ",";
        }
        _sql = _sql.substr(0, _sql.length - 1) + " where ";
        for (var index in whereObj) {
            _sql += index + "=@" + index + ",";
        }
        _sql = _sql.substr(0, _sql.length - 1);
        // 
        let _whereStr = JSON.stringify(whereObj);
        let _updateStr = JSON.stringify(this.updateObj);
        whereObj = JSON.parse(_updateStr.substr(0, _updateStr.length - 1) + ',' + _whereStr.substr(0, _whereStr.length - 1));
        //
        this.Execute(_sql, whereObj, callBack);
    },
    /**
     * 删除操作
     * @tableName 表名称
     * @params 删除条件参数
     * @whereSql 删除条件
     * @callBack 执行回调函数
     */
    del: function(tableName, params, whereSql, callBack) {
        if (IsEmpty(tableName)) {
            throw ('无效的数据库表名！');
        }
        if (IsEmpty(params)) {
            throw ('无效的删除参数！');
        }
        if (IsEmpty(whereSql)) {
            throw ('无效的删除条件');
        }
        let _sql = 'delete from ' + tableName + ' ';
        _sql += whereSql;
        this.Execute(_sql, params, callBack);
    }
};