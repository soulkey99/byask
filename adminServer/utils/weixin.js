/**
 * Created by MengLei on 2016-08-30.
 */
"use strict";
const API = require('co-wechat-api');
const request = require('request');
const config = require('./../../config').wx_config;
const baseUrl = 'https://api.weixin.qq.com/';
const redis = require('./../../config').redis;

let api = new API(config.mp_app_id, config.mp_app_secret, function *() {
    let res = yield [
        redis.get('SKTalent:wx:mp_access_token'),
        redis.get('SKTalent:wx:mp_access_token_expire')
    ];
    return {accessToken: res[0], expireTime: new Date(res[1]).getTime()};
}, function *(token) {
    yield [redis.set('SKTalent:wx:mp_access_token', token.accessToken),
        redis.set('SKTalent:wx:mp_access_token_expire', new Date(token.expireTime).toJSON())
    ]
});
api.registerTicketHandle(function *() {
    let res = yield [
        redis.get('SKTalent:wx:mp_js_ticket'),
        redis.get('SKTalent:wx:mp_js_ticket_expire')
    ];
    return {ticket: res[0], expireTime: new Date(res[1]).getTime()};
}, function *(type, ticket) {
    yield [
        redis.set('SKTalent:wx:mp_js_ticket', ticket.ticket),
        redis.set('SKTalent:wx:mp_js_ticket_expire', new Date(ticket.expireTime).toJSON())
    ];
});

exports.api = api;
exports.checkUser = function *(openid, access_token) {   //校验微信登陆传过来的openid和accessToken是否有效，如果有效，直接获取用户的信息并返回
//https://api.weixin.qq.com/sns/auth?access_token=_p5AZ_6lU8TJIot6MHBUDZfE2xtTJ9IT2yxWWZy2rplpARv5RXypyOfjvrr2bCZx8c6jsWTnLhZlCTzOvm7smpnx44_QolBEazbXk1h20TQ&openid=ojYONwG-LKiFFfBF49bWaKNNqBCc
    let res1 = yield req({
        url: `${baseUrl}sns/auth?access_token=${access_token}&openid=${openid}`,
        method: 'GET',
        json: true
    });
    let res = {valid: !res1.errcode, nick: '', avatar: '', unionid: '', errmsg: res1.errmsg};
    if (!res.valid) {
        return res;
    }
    let res2 = yield req({
        url: `${baseUrl}sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`,
        method: 'GET',
        json: true
    });
    res.nick = res2.nickname;
    res.avatar = res2.headimgurl;
    res.unionid = res2.unionid;
    return res;
};

//thunkify request
function req(opt, callback) {   //thunkify request
    return function (callback) {
        request(opt, (err, res, body)=> {
            callback(err, body);
        });
    }
}
