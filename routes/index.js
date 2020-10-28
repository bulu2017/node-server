var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, resp) => {
    resp.render('index', { title: '接口管理平台', desc: '这是一个接口管理平台' });
    // resp.send('接口管理平台')
});
router.get('/error', (req, resp) => {
    resp.render('error', {
        code: 404,
        title: '404异常',
        message: '您访问的页面不存在或无效',
        error: {
            status: 404,
            stack: '异常'
        }
    });
});


module.exports = router;