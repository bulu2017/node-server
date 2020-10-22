var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, resp) => {
    resp.send('接口管理平台')
});

module.exports = router;