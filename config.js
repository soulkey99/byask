/**
 * Created by MengLei on 2016-06-07.
 */
"use strict";
const fs = require('fs-extra');
const path = require('path');
const UMENG = require('umeng');
const redis = require('then-redis');

//mongodb配置
exports.db = {
    production: '', //生产环境
    development: 'mongodb://127.0.0.1:27017',   //开发环境
    test: 'mongodb://127.0.0.1:27017',   //测试环境
    prod_path: '',   //生产环境数据库路径
    dev_path: '/byask_test',    //开发环境数据库路径
    test_path: '/byask_test',   //测试环境数据库路径
    prod_user_path: '',   //生产环境user数据库路径
    dev_user_path: '/byserver',    //开发环境user数据库路径
    test_user_path: '/byserver'     //测试环境user数据库路径
};

//redis 配置
let redisConfig = {
    host: '127.0.0.1',
    port: 6379
};
exports.redisConfig = redisConfig;
exports.redis = redis.createClient({host: '127.0.0.1', port: 6379});

exports.wx_config = {
    mp_app_id: process.env.NODE_ENV == 'production' ? '' : '',
    mp_app_secret: process.env.NODE_ENV == 'production' ? '' : '',
    mp_token: '',
    open_app_id: '',
    open_app_secret: ''
};

//oss key
exports.oss_config = {
    key: '',
    secret: '',
    bucket: '',
    prefix: ''
};

//qiniu key
exports.qiniu_conf = {
    key: '',
    secret: '',
    bucket: '',
    prefix: ''
};

//云通讯
exports.ytx = {
    accountSid: '',
    authToken: '',
    subAccountSid: '',
    subToken: '',
    voipAccount: '',
    voipPwd: '',
    appID: '',
    appToken: ''
};

//网易云信呼叫
exports.netease = {
    appKey: '',
    appSecret: ''
};

//友盟推送key
let umeng_config = {
    appKey: '', //安卓key
    app_master_secret: '',  //安卓secret
    ios_appKey: '',     //ios key
    ios_app_master_secret: ''   //ios secret
};
exports.umeng = new UMENG(umeng_config);

//随机数生成器
exports.rack = require('hat').rack();

//ping++ key
let pingxx_config = {
    app_id: '',    //
    secret_key: process.env.NODE_ENV == 'production' ? '' : ''
};
exports.pingxx_config = pingxx_config;
exports.pingpp = require('pingpp')(pingxx_config.secret_key);

//ping++ 公钥
exports.pingpp_pub_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs20+Ey5ldxTOFfwpaRgI
dXMvcnK17zBAHm1Aagv+s9YsXftUaE/1taGsRflrefcleA0osNJPI+jJNDocJC6K
7qAYNqW/p8MFklEWII+ER70ASSeS1pcnPlA3meoRLEA1cXp/iUPUqaczlU6w+Hxo
a8mtuQh2Tf93TZTNc9feMD+533ZvZmyTo7Gl02YeuZTtETrkA6bLcxCTuxe3zOwO
AhDaYqF1Jji0iGqMzoMs/dNW15RFgS/2BJAp5sz+a/1cs+4oXJRXkvru4sYTBV3f
tAbTGP10MYUj+9mlCjutoIpcPPS/XLa28aawcm8/Nk5VX3f1nj/RocA3bNDo5JMj
HwIDAQAB
-----END PUBLIC KEY-----
`;

//leancloud key
exports.sms_config = {
    'X-LC-Id': '',
    'X-LC-Key': '',
    'Content-Type': 'application/json'
};

//端口配置
exports.port = {
    ssl_inc: 1000,
    admin: 8070,
    app: 8071,
    file: 8072
};

//ssl配置
exports.ssl_opt = (process.env.NODE_ENV == 'production' ? {
    key: fs.readFileSync(path.join(__dirname, './utils/cert/prod.key')),
    cert: fs.readFileSync(path.join(__dirname, './utils/cert/prod.crt'))
} : {
    key: fs.readFileSync(path.join(__dirname, './utils/cert/test.key')),
    cert: fs.readFileSync(path.join(__dirname, './utils/cert/test.crt'))
});
