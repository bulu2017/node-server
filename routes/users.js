var express = require('express');
var router = express.Router();
//路由对象
var { GetList, CreateUser, GetById } = require('../controllers/UserController');

router.get('/user', GetList);
router.get('/user/:id', GetById);
router.post('/user', CreateUser);

module.exports = router;