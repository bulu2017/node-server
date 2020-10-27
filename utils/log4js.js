const path = require('path');
const _log = require('log4js');

/**
 * 第一种：
 * configure方法为配置log4js对象，内部有levels、appenders、categories三个属性
 * levels:
 *         配置日志的输出级别,共ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF八个级别,default level is OFF
 *         只有大于等于日志配置级别的信息才能输出出来，可以通过category来有效的控制日志输出级别
 * appenders:
 *         配置文件的输出源，一般日志输出type共有console、file、dateFile三种
 *         console:普通的控制台输出
 *         file:输出到文件内，以文件名-文件大小-备份文件个数的形式rolling生成文件
 *         dateFile:输出到文件内，以pattern属性的时间格式，以时间的生成文件
 * replaceConsole:
 *         是否替换控制台输出，当代码出现console.log，表示以日志type=console的形式输出
 *
 */
const _logPath = path.join(__dirname, 'public\\logs\\');
_log.levels = "DEBUG";
_log.configure({
    appenders: {
        everything: {

        }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
    // appenders: [{
    //         type: 'console',
    //         category: "console"
    //     }, {
    //         type: "file",
    //         filename: _logPath + "log-info.log",
    //         maxLogSize: 10 * 1024 * 1024, // = 10Mb
    //         numBackups: 5, // keep five backup files
    //         compress: true, // compress the backups
    //         encoding: 'utf-8', //default "utf-8"，文件的编码
    //         mode: parseInt('0640', 8),
    //         flags: 'w+'
    //     },
    //     {
    //         type: "dateFile",
    //         filename: _logPath,
    //         pattern: "yyyy-MM-dd-hh",
    //         compress: true
    //     },
    //     {
    //         type: "stdout"
    //     }
    // ]
})

module.exports = _log;