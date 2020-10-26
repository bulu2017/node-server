/**
 * 数据库工厂
 */
const config = require('../config');
const _mysql = require('./mysqldb');
const _mssql = require('./mssqldb');
const _pgsql = require('./pgsqldb');
const _oraclesql = require('./oracledb');


module.exports = {
    /**
     * 
     */
    createFactory: () => {
        let _dbContext = _mysql;
        switch (config.database.dbType) {
            case 'mysql':
                _dbContext = _mysql;
                break;
            case 'sqlserver':
                _dbContext = _mssql;
                break;
            case 'pgsql':
                _dbContext = _pgsql;
                break;
            case 'oracle':
                _dbContext = _oraclesql;
                break;
            default:
                _dbContext = _mysql;
                break;
        }
        return _dbContext;
    }
}