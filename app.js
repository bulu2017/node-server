let path = require('path');
let express = require('express');
let cookie = require('cookie-parser'); // cookie中间件
let logger = require('morgan'); //日志中间件
let http = require('http');
let bodyParser = require('body-parser'); //HTTP请求体解析的中间件
// let createError = require('http-errors');
// 全局参数
const config = require('./config');

let app = express();
let server = http.createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(express.static(path.join(__dirname, 'public')));
//配置解析普通表单post请求体 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// // 解析 application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded());
// // 解析 application/json
// app.use(bodyParser.json()); 
// // 解析 text/plain
// app.use(bodyParser.json({type: 'text/plain'}))

//允许跨域操作
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

// 定义路由
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let fileRouter = require('./routes/upload'); // 文件上传路由

app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api', usersRouter);
app.use('/api', fileRouter);

/**
 * 接口地址不存储异常处理
 */
app.use(function(req, res, next) {
    next(res.json({ code: 404, msg: '请求接口不存在', data: null }));
});
/**
 * 程序执行过程中异常处理
 */
app.use(function(err, req, res, next) {
    err = err || '服务器请求异常，请稍后再试！'
    next(res.json({ code: 500, msg: err, data: null }));
});

/**
 * 监听端口
 */
server.listen(config.network.port, () => {
    console.log('——————————服务已启动——————————');
})