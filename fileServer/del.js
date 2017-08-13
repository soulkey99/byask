/**
 * Created by MengLei on 2016-06-15.
 */
"use strict";
const path = require('path');
const ALY = require('aliyun-sdk');
const oss_config = require('../config').oss_config;
const thunkify = require('thunkify');

const oss = new ALY.OSS({
    accessKeyId: oss_config.key,
    secretAccessKey: oss_config.secret,
    //endpoint选择：外网使用http://oss-cn-beijing.aliyuncs.com，阿里云内网使用http://oss-cn-beijing-internal.aliyuncs.com，速度无限制
    endpoint: !process.NODE_ENV ? 'http://oss-cn-beijing.aliyuncs.com' : 'http://oss-cn-beijing-internal.aliyuncs.com',
    apiVersion: '2013-10-15'    // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
});
let ossDel = function (opt, callback) {
    return function (callback) {
        oss.deleteObject(opt, callback);
    }
};

module.exports = function *() {
    let key = this.request.body.filePath;
    try {
        yield ossDel({Bucket: oss_config.bucket, Key: key});
        return result(this, {code: 900});
    } catch (ex) {
        return result(this, {code: 905, msg: ex.message}, 500);
    }
};
