/**
 * Created by MengLei on 2016-06-20.
 */
"use strict";
const model = require('../../model');

exports.httpMiddle = function *(next) {
    try {
        yield next;
    } catch (ex) {
        throw(ex);
    }
    let ctx = this;
    let res = this.res;
    let onFinish = done.bind(null, 'finish');
    let onClose = done.bind(null, 'close');
    res.once('finish', onFinish);
    res.once('close', onClose);
    function done() {
        res.removeListener('finish', onFinish);
        res.removeListener('close', onClose);
        //记录log
        addHttpLog(ctx);
    }
};

function addHttpLog(ctx) {
    let log = new (model.HttpLog)({_id: null});
    log.method = ctx.method;
    log.reqPath = ctx.path;
    log.reqHeader = ctx.header;
    log.reqParams = ctx.params;
    log.reqQuery = ctx.request.query;
    log.reqBody = ctx.request.body;
    log.resHeader = ctx.response.header;
    log.resStatus = ctx.status;
    log.resBody = ctx.body;
    log.save();
}

/**
 * 记录HTTP Log
 * @param param = {userID: '', reqHeader: '', method: '', reqPath: '', reqParams: '', reqQuery: '', reqBody: '', resHeader: '', resStatus: '', resBody: ''}
 */
exports.httpLog = function (param) {
    let log = new (model.HttpLog)();
    if (param.userID) {
        log.userID = param.userID;
    }
    log.reqIP = param.reqIP;
    log.reqHeader = param.reqHeader;
    log.method = param.method;
    log.reqPath = param.reqPath;
    log.reqParams = param.reqParams;
    log.reqQuery = param.reqQuery;
    log.reqBody = param.reqBody;
    log.resHeader = param.resHeader;
    log.resStatus = param.resStatus;
    log.resBody = param.resBody;
    log.save(err=> {
        if (err) {
            //
        }
    });
};


/**
 * 记录用户行为Log
 * @param info = {userID: '', action: '', content: {}}
 */
exports.userLog = function (info) {
    let log = new (model.UserLog)();
    log.userID = info.userID;
    log.action = info.action;
    log.content = info.content;
    if (log.content.ip) {
        let str = log.content.ip;
        if (/^(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+/g.test(str)) {
            log.content.ip = str.slice(str.lastIndexOf(':') + 1, str.length);
        }
    }
    log.save();
};

/**
 * 获取用户log列表
 * @param param = {userID: '', start: '', limit: '', action: '', startAt: '', endAt: '', imei: '', mac: '', ip: '', platform: '', client: '', channel: ''}
 */
exports.getUserLog = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.startAt && param.endAt) {
        query['createdAt'] = {$gte: new Date(param.startAt), $lte: new Date(param.endAt)};
    } else if (param.startAt) {
        query['createdAt'] = {$gte: new Date(param.startAt)};
    } else if (param.endAt) {
        query['createdAt'] = {$lte: new Date(param.endAt)};
    }
    if (param.userID) {
        query['userID'] = param.userID;
    }
    if (param.action) {
        query['action'] = param.action;
    }
    if (param.imei) {
        query['content.imei'] = param.imei;
    }
    if (param.mac) {
        query['content.mac'] = param.mac;
    }
    if (param.ip) {
        query['content.ip'] = param.ip;
    }
    if (param.platform) {
        query['content.platform'] = param.platform;
    }
    if (param.channel) {
        query['channel'] = param.channel;
    }
    let res = yield model.UserLog.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = res[i].toInfo();
        let user = yield model.User.findById(item.userID);
        item.expert_status = user.expert_status;
        item.phone = user.phone;
        item.nick = user.nick;
        item.name = user.userInfo.name;
        list.push(item);
    }
    return list;
};

