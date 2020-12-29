let path = require('path');
let express = require('express');
let cookie = require('cookie-parser'); // cookie中间件
let logger = require('morgan'); //日志中间件
let http = require('http');
let bodyParser = require('body-parser'); //HTTP请求体解析的中间件
const expressJwt = require('express-jwt'); //JWT解析中间件
const jsonwebtoken = require('jsonwebtoken');
// let createError = require('http-errors');
// 全局参数
const config = require('./config');
const log4js = require('./utils/log4js').logger('everything');
//微服务相关
let Seneca = require('seneca');
let senecaWeb = require('seneca-web'); //
let senecaAdapter = require('seneca-web-adapter-express'); //适配器
var routes = require('./config/routes');
let plugin = require('./config/plugin');

let app = express();
// let server = http.createServer(app);

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
// console.log(path.join(__dirname, 'log'));
//允许跨域操作
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

// jwt 解析
app.use(expressJwt({
    secret: config.jwt.secret, // 签名的密钥 或 PublicKey
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
        let _token = null;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            _token = req.headers.authorization.split(' ')[1]
        } else if (req.query && req.query.token) {
            _token = req.query.token
        }
        if (!IsEmpty(_token)) {
            // 解析token 并且进行相关操作校验
            let data = jsonwebtoken.verify(_token, config.jwt.secret);
            return _token
            // jsonwebtoken.verify(_token, config.jwt.secret, (_error, data) => {
            //     if (_error) {
            //         _token = null;
            //     }
            //     let nowTime = (new Date()).getTime();
            //     // if(nowTime-ctime<expiresIn){
            //     //     result = data;        
            //     // }
            //     // { name: 'bulu', iat: 1603791542, exp: 3207586684 }
            //     return _token;
            // });
        }
        return null;
    }
}).unless({
    path: ['/', '/error', '/api/user/auth'] // 指定路径不经过 Token 解析
}))

// 定义路由
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let fileRouter = require('./routes/upload'); // 文件上传路由
const jwt = require('express-jwt');
const { IsEmpty } = require('./utils/verify');

app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api', usersRouter);
app.use('/api', fileRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * 接口地址不存储异常处理
 */
app.use(function(req, res, next) {
    log4js.error('接口地址不存在：', res.message);
    next(res.json({ code: 404, msg: '请求接口不存在', data: null }));
});
/**
 * 程序执行过程中异常处理
 */
app.use(function(err, req, res, next) {
    log4js.error('接口异常：', (err.code || ''), err.message);
    if (err.name === 'UnauthorizedError') {
        // console.log(err.message)
        if (err.message === 'jwt expired') {
            res.status(401).json({ code: -1, msg: 'token过期', data: {} });
        } else {
            res.status(401).json({ code: -1, msg: '无效的token', data: {} });
        }
    } else {
        err = err.message || '服务器请求异常，请稍后再试！'
        next(res.json({ code: 500, msg: err.message, data: null }));
    }
});

/**
 * 监听端口
 */
// server.listen(config.network.port, () => {
//     console.log('——————————服务已启动——————————');
// })

//微服务配置
let senecaWebConfig = {
    routes: routes,
    adapter: senecaAdapter,
    context: app
};
const seneca = Seneca()
    .use(plugin)
    .use(senecaWeb, senecaWebConfig)
    .use('../services')
    .ready(() => {
        const server = seneca.export('web/context')();
        server.listen(config.network.port, () => {
            console.log('——————————服务已启动——————————');
        });
    });