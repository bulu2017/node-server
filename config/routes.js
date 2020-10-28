'use strict'

module.exports = [{
    prefix: '/api/user', //生成的web路由的前缀
    pin: 'role:user,cmd:*', //可以匹配多个模式的模式。比如pin='role:user,cmd:*'，可以匹配role=user,cmd为任意值的模式
    map: { //如果pin匹配了多个模式，每个模式在map中作为一个键再设置其它属性。可以看到两个route的map一共有三个键（list,edit,validate）分别匹配了plugin中定义的pattern
        //路由的url: Get /todo/list
        //路由url生成规则一：/${prefix}/${key}/${postfix}/${suffix}
        //得到的结果: {"ok":true}
        list: { GET: true, name: '' },
        load: { GET: true, name: '', suffix: '/:id' },
        edit: { PUT: true, name: '', suffix: '/:id' },
        create: { POST: true, name: '' },
        delete: { DELETE: true, name: '', suffix: '/:id' }
    }
}]