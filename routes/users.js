var express = require('express');
var router = express.Router();
//路由对象
var user = require('../controllers/UserController');

router.get('/user', user.GetList).post(user.Create);
router.get('/user/:id', user.GetById);


module.exports = router;