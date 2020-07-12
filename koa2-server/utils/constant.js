/**
 * Created by yanyue on 2020/3/13 22:38
 * 常用全局常量
 */

module.exports = {
    //生成token的主键密钥
    PRIVATE_KEY: 'g-web',
    //token的失效时间（1小时）
    JWT_EXPIRED: 60 * 60 * 2, //单位s token失效时间
    //mongodb数据库的url地址
    //dbUrl: "mongodb://localhost:27017/g-web",
    dbUrl: "mongodb://121.196.183.67:27017/g-web",  //阿里云mongodb数据库地址
    //FileUploadPath: "D:\\YAYO-WEB\\upload"
    FileUploadPath: "/usr/local/nginx/upload"
};


