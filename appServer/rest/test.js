/**
 * Created by MengLei on 2016-07-04.
 */
"use strict";
const umeng = require('../../config').umeng;

exports.verify = function *(next) {
    let userID = this.params.userID;
    let apply = yield proxy.ExpertApply.lastApply(userID);
    let info = yield proxy.ExpertApply.verify(apply.apply_id, 'verified');
    return result(this, {code: 900, info});
};

exports.umeng = function *(next) {
    let self = this;
    let reqBody = this.request.body;
    if (reqBody.client == 'ios') {
        let body = {};
        body.aps = {
            alert: reqBody.content,
            sound: 'default'
        };
        let push = {
            type: reqBody.type || 'customizedcast',
            alias_type: 'calltalent',
            alias: reqBody.dest,
            payload: {
                body: body
            },
            production_mode: reqBody.mode || (process.NODE_ENV == 'production' ? 'true' : 'false')
        };
        let data = yield umeng.iosPush(push);
        logger.trace(`umeng push to ios ${reqBody.dest} success: ` + JSON.stringify(data));
        return result(this, {code: 900, data});
    } else {
        let body = {
            ticker: reqBody.ticker,
            title: reqBody.title,
            text: reqBody.text,
            play_vibrate: 'true',
            play_lights: 'true',
            play_sound: 'true',
            after_open: 'go_app',
            custom: {
                key: 'value'
            }
        };
        let extra = {};
        let policy = {};

        let push = {
            type: reqBody.type || 'customizedcast',
            alias_type: 'calltalent',
            alias: reqBody.dest,
            display_type: 'notification',
            body: body,
            extra: extra,
            policy: policy,
            production_mode: reqBody.mode || (process.NODE_ENV == 'production' ? 'true' : 'false')
        };
        let data = yield umeng.androidPush(push);
        logger.trace(`umeng push to android ${reqBody.dest} success: ` + JSON.stringify(data));
        return result(this, {code: 900, data});
    }
};

exports.kill = function *(next) {
    if (process.NODE_ENV != 'production') {
        let user = proxy.User.getUserById(this.state.userID);
        if (!user) {
            return result(this, {code: 902, msg: '用户不存在！'});
        }
        user.phone += '_' + Date.now().toString();
        yield user.save();
        return result(this, {code: 900});
    } else {
        yield next;
    }
};

exports.post = function *(next) {
    console.log(this.request.body);
    return result(this, {code: 900});
};