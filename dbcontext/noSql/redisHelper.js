const redis = require('redis');

/**
 * Redis 封装
 */
module.exports = ({
    redisClient,
    config: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        detect_buffers: true, // 传入buffer 返回也是buffer 否则会转换成String
        dbNum: 0
    },
    init: function() {
        this.redisClient = redis.createClient({
            host: this.config.host,
            port: this.config.port,
            password: this.config.password,
            detect_buffers: this.config.detect_buffers, // 传入buffer 返回也是buffer 否则会转换成String
            retry_strategy: function(options) {
                // 重连机制
                if (options.error && options.error.code === "ECONNREFUSED") {
                    // End reconnecting on a specific error and flush all commands with
                    // a individual error
                    return new Error("The server refused the connection");
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    return new Error("Retry time exhausted");
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            }
        }).on("error", this.onError);
    },
    onError: function(err) {
        console.log("redis error: " + err);
    },
    /**
     * 存储值
     * @param {*} key 
     * @param {*} value 
     * @param {*} exprires 秒钟 默认为86400秒（一天）
     */
    setValue: function(key, value, exprires = 86400) {
        if (typeof value === 'string') {
            this.redisClient.set(key, value)
        } else if (typeof value === 'object') {
            for (let item in value) {
                this.redisClient.hmset(key, item, value[item], redis.print)
            }
        }
        //设置过期 单位：秒
        if (exprires) {
            redisClient.expire(key, exprires);
        }
    },
    /**
     * 读取值
     * @param {*} key 
     */
    getValue: function(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        });
    },
    /**
     * 读取hash值
     * @param {*} key 
     */
    getHValue: function(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.hgetall(key, function(err, value) {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            })
        });
    }
}).init();