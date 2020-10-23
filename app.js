var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser'); // cookie中间件
var logger = require('morgan'); //日志中间件
var http = require('http');
var createError = require('http-errors');

var app = express();
var server = http.createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 定义路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileRouter = require('./routes/file'); // 文件上传路由

app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api', usersRouter);
app.use('/api', fileRouter);

// 捕获接口异常
app.use(function(req, res, next) {
    next(res.json({ code: 404, msg: '请求接口不存在', data: null }));
});
// app.use(function(err, req, res, next) {
//     console.log(err.stack)
//         // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });


/* 监听端口 */
server.listen(8686, () => {
    console.log('——————————服务已启动——————————');
})