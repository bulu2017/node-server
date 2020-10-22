const mysql = require('mysql');

module.exports = {
    config: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'node_db',
        multipleStatements: true
    },
    // 链接数据库，使用mysql 的链接池链接方式
    sqlConnect: function(sql, sqlArr, callback) {
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
    SyncSqlConnect: function(sql, sqlArr) {
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
    }
}