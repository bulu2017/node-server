module.exports = {
    network: {
        port: 8083
    },
    jwt: {
        secret: 'secret'
    },
    database: {
        dbType: 'mysql' // 需要链接的数据库类型,已引入mysql,sqlserver,oracle,pgsql组件支持
    },
    fs: {
        uploadPath: './public/uploads/', // 上传目录
        num: 10, // 多文件上传最多允许上传数量
        saveOriginalName: false, //上传文件是否保留原始文件名称
    }
}