/**
 * Created by MengLei on 2016-06-15.
 */
"use strict";
const rack = require('../config').rack;
const path = require('path');
const ALY = require('aliyun-sdk');
const qiniu = require('qiniu');
const oss_config = require('../config').oss_config;
const qn_config = require('../config').qiniu_conf;
const fs = require('co-fs-extra');
const dateUtil = require('../utils/date');
const local_config = {
    prefix: process.env.NODE_ENV == 'production' ? 'http://file.iwenda.me/upload/' : 'http://file.test.iwenda.me/upload/',
    filePath: '../public/upload/'
};

const oss = new ALY.OSS({
    accessKeyId: oss_config.key,
    secretAccessKey: oss_config.secret,
    //endpoint选择：外网使用http://oss-cn-beijing.aliyuncs.com，阿里云内网使用http://oss-cn-beijing-internal.aliyuncs.com，速度无限制
    endpoint: !process.env.NODE_ENV ? 'http://oss-cn-beijing.aliyuncs.com' : 'http://oss-cn-beijing-internal.aliyuncs.com',
    apiVersion: '2013-10-15'    // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
});
qiniu.conf.ACCESS_KEY = qn_config.key;
qiniu.conf.SECRET_KEY = qn_config.secret;

let ossPut1 = function (opt, callback) {
    return function (callback) {
        oss.putObject(opt, callback);
    }
};
let qnPut = function (opt, callback) {  //opt = {key: '', localFile: ''}
    let extra = new qiniu.io.PutExtra();
    let putPolicy = new qiniu.rs.PutPolicy(`${qn_config.bucket}:${opt.key}`);
    return function (callback) {
        qiniu.io.putFile(putPolicy.token(), opt.key, opt.localFile, extra, callback);
    }
};

module.exports = function *() {
    let dateStr = dateUtil.genDateStr();
    let fileName = this.request.body.files.upload.name;
    let tmpPath = this.request.body.files.upload.path;
    let filePath = this.request.body.fields.path || path.join('sktalent', dateStr, rack() + path.extname(fileName).toLowerCase()).replace(/\\/g, '/');
    let cd = (filePath.lastIndexOf('jpg') > 0 || fileName.lastIndexOf('png') > 0 || fileName.lastIndexOf('gif') > 0) ? 'inline; filename="' + fileName + '"' : '';
    let ct = contentType(filePath);
    try {
        if (this.request.body.fields.vendor == 'qn') {
            let opt = {
                localFile: tmpPath,
                key: filePath
            };
            yield qnPut(opt);
            return result(this, {code: 900, filePath: qn_config.prefix + filePath});
        } else if (this.request.body.fields.vendor == 'local') {
            let opt = {
                clobber: this.request.body.fields.overwrite == 'true'
            };
            try {
                yield fs.move(tmpPath, path.join(local_config.filePath, filePath), opt);
            } catch (ex) {
                if (ex.message.indexOf('EEXIST') >= 0) {
                    return result(this, {code: 905, msg: '上传文件失败，文件已存在，请选择更换文件名，或者覆盖该文件！'});
                }
            }
            return result(this, {code: 900, filePath: local_config.prefix + filePath});
        } else {
            let data = yield fs.readFile(tmpPath);
            yield ossPut1({
                Bucket: oss_config.bucket,
                Key: filePath,
                Body: data,
                ContentType: ct,
                AccessControlAllowOrigin: '',
                ContentDisposition: cd,
                CacheControl: 'no-cache'
            });
            return result(this, {code: 900, filePath: oss_config.prefix + filePath});
        }
    } catch (ex) {
        return result(this, {code: 905, msg: `上传文件失败！${ex.message}`}, 500);
    }
};

function contentType(filePath) {
    var contentType = 'application/octet-stream';
    switch (path.extname(filePath)) {
        case '.jpeg':
        case '.jpg':
        case '.jpe':
        case '.jfif':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.tif':
        case '.tiff':
            contentType = 'image/tiff';
            break;
        case '.fax':
            contentType = 'image/fax';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
        case '.net':
            contentType = 'image/pnetvue';
            break;
        case '.bmp':
            contentType = 'application/x-bmp';
            break;
        case '.amr':
            contentType = 'audio/amr';
            break;
        case '.ogg':
            contentType = 'audio/ogg';
            break;
        case '.wma':
            contentType = 'audio/x-ms-wma';
            break;
        case '.wav':
            contentType = 'audio/x-wav';
            break;
        case '.mp3':
            contentType = 'audio/mp3';
            break;
        case '.ra':
            contentType = 'audio/vnd.rn-realaudio';
            break;
        default :
            break;
    }
    return contentType;
}