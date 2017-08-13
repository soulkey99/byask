/**
 * Created by MengLei on 2016-07-12.
 */
"use strict";

const qiniu = require('qiniu');
const rack = require('../../config').rack;
const path = require('path');
const qn_config = require('../../config').qiniu_conf;
const dateUtil = require('../../utils/date');
const request = require('request');
const fs = require('fs');

qiniu.conf.ACCESS_KEY = qn_config.key;
qiniu.conf.SECRET_KEY = qn_config.secret;
let qnPut = function (opt, callback) {  //opt = {key: '', localFile: ''}
    let extra = new qiniu.io.PutExtra();
    let putPolicy = new qiniu.rs.PutPolicy(`${qn_config.bucket}:${opt.key}`);
    return function (callback) {
        qiniu.io.putFile(putPolicy.token(), opt.key, opt.localFile, extra, callback);
    }
};

//上传文件转发至oss
exports.upload = function *(next) {
    let dateStr = dateUtil.genDateStr();
    let body = this.request.body;
    let fileName = body.files.upload.name;
    let tmpPath = body.files.upload.path;
    let filePath = body.fields.path || path.join('sktalent', dateStr, rack() + path.extname(fileName).toLowerCase()).replace(/\\/g, '/');
    try {
        if (body.fields.vendor == 'qn') { //对于上传到七牛的文件，直接上传，不走fileserver进行中转
            let opt = {localFile: tmpPath, key: filePath};
            let put = yield qnPut(opt);
            return result(this, {code: 900, info: qn_config.prefix + filePath});
        }
        let opt = {
            url: 'http://test.soulkey99.com:8072/upload',
            method: 'POST',
            formData: {
                path: body.fields.path || '',
                vendor: body.fields.vendor || '',
                upload: {
                    value: require('fs').createReadStream(tmpPath),
                    options: {
                        filename: fileName,
                        contentType: body.files.upload.type
                    }
                }
            }
        };
        let res = yield req(opt);
        return result(this, res[1]);
    } catch (ex) {
        return result(this, {code: 905, msg: '服务器内部错误_' + ex.message || ex.error}, 500);
    }
    function req(o, callback) {
        return function (callback) {
            require('request')(o, callback);
        }
    }
};

//获取意见反馈主列表
exports.feedback = function *(next) {
    let param = {
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit
    };
    let list = yield proxy.Feedback.getAdminList(param);
    return result(this, {code: 900, list});
};

//获取单人意见反馈列表
exports.userFeedback = function *(next) {
    let param = {
        userID: this.params.userID,
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit
    };
    let list = yield proxy.Feedback.getList(param);
    return result(this, {code: 900, list});
};

//回复意见反馈
exports.replyFeedback = function *(next) {
    let param = {
        userID: this.request.body.u_id,
        content: this.request.body.content,
        direction: 'a2u'
    };
    let feedback = yield proxy.Feedback.createFeedback(param);
    //mqtt通知
    mqttSend(param.userID, 'feedback', {content: param.content});
    return result(this, {code: 900, feedback_id: feedback.feedback_id});
};

//获取在线参数列表
exports.getConfigs = function *(next) {
    let param = {
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit,
        platform: this.request.query.platform,
        valid: this.request.query.valid
    };
    let list = yield proxy.OnlineConfig.getAdminList(param);
    return result(this, {code: 900, list});
};

//新增、编辑在线参数
exports.editConfig = function *(next) {
    let body = this.request.body;
    let config = {};
    if (this.params.config_id) {    //传了config_id那就是编辑
        config = yield proxy.OnlineConfig.getConfigByID(this.params.config_id);
        if (!config) {
            return result(this, {code: 911, msg: '要修改的记录不存在！'}, 404);
        }
        if (body.value != undefined) {
            config.value = body.value;
        }
        if (body.valid != undefined) {
            config.valid = body.valid == 'true';
        }
        if (body.desc != undefined) {
            config.desc = body.desc;
        }
        yield config.save();
    } else {
        config = yield proxy.OnlineConfig.addConfig({
            key: body.key,
            value: body.value,
            platform: body.platform,
            desc: body.desc
        });
    }
    return result(this, {code: 900, config_id: config.config_id});
};

//获取更新列表
exports.getUpdate = function*(next) {
    let body = this.request.query;
    let param = {
        platform: body.platform,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Update.getList(param);
    return result(this, {code: 900, list});
};

//添加、编辑一条更新记录
exports.addUpdate = function*(next) {
    let body = this.request.body;
    if (this.params.update_id) {
        let update = yield proxy.Update.getUpdateById(this.params.update_id);
        if (body.url != undefined) {
            update.url = body.url;
        }
        if (body.desc != undefined) {
            update.desc = body.desc;
        }
        if (body.code != undefined) {
            update.code = body.code;
        }
        if (body.version != undefined) {
            update.version = body.version;
        }
        if (body.platform != undefined) {
            update.platform = body.platform;
        }
        if (body.valid != undefined) {
            update.valid = body.valid == 'true';
        }
        if (body.time != undefined) {
            update.time = body.time;
        }
        yield update.save();
        return result(this, {code: 900, update_id: update.update_id});
    } else {
        let param = {
            platform: body.platform,
            version: body.version,
            code: body.code,
            url: body.url,
            desc: body.desc,
            time: body.time,
            valid: body.valid
        };
        let update = yield proxy.Update.add(param);
        return result(this, {code: 900, update_id: update.update_id});
    }
};

//生成一个推广码
exports.genShareCode = function *(next) {
    let param = {
        desc: this.request.body.desc
    };
    let shareCode = yield proxy.Promote.genShareCode(param);
    //let link = (process.env.NODE_ENV == 'production' ? 'http://api.iwenda.me/download/index.html' : 'http://api.test.iwenda.me/download/index.html') + '?shareCode=' + shareCode.shareCode;
    return result(this, {code: 900, info: shareCode.toInfo()});
};

//编辑推广码描述
exports.editShareCode = function *(next) {
    let shareCode = yield proxy.Promote.getShareCode(this.params.shareCode);
    if (!shareCode) {
        return result(this, {code: 911, msg: '对应的推广码不存在！'});
    }
    shareCode.desc = this.request.body.desc;
    yield shareCode.save();
    return result(this, {code: 900, shareCode: shareCode.shareCode});
};

//获取推广码列表
exports.getCodeList = function *(next) {
    let param = {
        key: this.request.query.key,
        startAt: this.request.query.startAt,
        endAt: this.request.query.endAt,
        start: this.request.query.start,
        limit: this.request.query.limit
    };
    let list = yield proxy.Promote.getCodeList(param);
    return result(this, {code: 900, list});
};

//获取指定二维码对应的推广效果
exports.getCodeStat = function *(next) {
    let param = {
        shareCode: this.params.shareCode,
        startAt: this.request.query.startAt,
        endAt: this.request.query.endAt
    };
    let stat = yield proxy.Promote.adminGetStat(param);
    return result(this, {code: 900, stat});
};

//获取指定二维码推广列表
exports.getCodePromoteList = function *(next) {
    let param = {
        shareCode: this.params.shareCode,
        startAt: this.request.query.startAt,
        endAt: this.request.query.endAt,
        start: this.request.query.start,
        limit: this.request.query.limit,
        type: this.request.query.type
    };
    let list = yield proxy.Promote.adminGetList(param);
    return result(this, {code: 900, list});
};

//获取推广数据
exports.getPromote = function *(next) {
    //
}