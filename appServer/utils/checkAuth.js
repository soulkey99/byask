/**
 * Created by MengLei on 2016-06-01.
 */
"use strict";
const proxy = require('./../../common/proxy/index');
const model = require('./../../common/model/index');
const redis = require('./../../config').redis;
const qs = require('querystring');

//校验登陆状态，header中放置一个auth字符串，格式为userID=xxx&session_id=xxx，并对其进行base64编码
exports.required = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
    if (!q.userID || !q.authSign || !validator.isMongoId(q.userID)) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }

    let user = yield model.User.findById(q.userID);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (user.block_util && user.block_util > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
    }
    if (user.authSign != q.authSign) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    this.state.userID = q.userID;
    this.state.user = user.toObject({getters: true});
    yield next;
};

//可选校验登陆状态，如果客户端传了则必须校验通过，如果没传则直接next
exports.optional = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        yield next;
        return;
    }
    let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
    if (!q.userID || !q.authSign) {
        return yield next;
    }
    if (!validator.isMongoId(q.userID)) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    let user = yield model.User.findById(q.userID);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (user.block_util && user.block_util > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
    }
    if (user.authSign != q.authSign) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    this.state.userID = q.userID;
    this.state.user = user.toObject({getters: true});
    yield next;
};

//仅提取userID，不校验authSign
exports.checkUser = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        return yield next;
    }
    try {
        let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
        if (q.userID && validator.isMongoId(q.userID)) {
            let user = yield model.User.findById(q.userID);
            if (user) {
                if (user.block_util && user.block_util > Date.now()) {
                    return result(this, {code: 909, msg: '用户被封禁，无法使用！'}, 400);
                }
                this.state.userID = q.userID;
                this.state.user = user.toObject({getters: true});
            }
        }
    } catch (ex) {
        yield next;
    }
    return yield next;
};
