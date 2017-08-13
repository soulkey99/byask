/**
 * Created by MengLei on 2016-07-12.
 */
"use strict";
const qs = require('querystring');
const request = require('request');
const auth = require('../config').netease;
const baseUrl = 'https://api.netease.im/';

/**
 * 调用网易云信进行呼叫
 * @param param = {caller: '', callee: '', maxDur: ''}
 * @returns {*}
 */
exports.call = function *(param) {
    let nonce = require('crypto').randomBytes(48).toString('hex');
    let curTime = Math.ceil(Date.now() / 1000).toString();
    let checkSum = sha1(auth.appSecret + nonce + curTime);
    let opt = {
        url: `${baseUrl}call/ecp/startcall.action`,
        method: 'POST',
        headers: {
            'AppKey': auth.appKey,
            'Nonce': nonce,
            'CurTime': curTime,
            'CheckSum': checkSum,
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        form: {
            callerAcc: 'caller',
            caller: param.caller,
            callee: param.callee,
            maxDur: param.maxDur || '120',
            record: true
        }
    };
    let res = yield req(opt);
    return JSON.parse(res[1]);
};

exports.check = function *(session) {
    let nonce = require('crypto').randomBytes(48).toString('hex');
    let curTime = Math.ceil(Date.now() / 1000).toString();
    let checkSum = sha1(auth.appSecret + nonce + curTime);
    let opt = {
        url: `${baseUrl}call/ecp/queryBySession.action`,
        method: 'POST',
        headers: {
            'AppKey': auth.appKey,
            'Nonce': nonce,
            'CurTime': curTime,
            'CheckSum': checkSum,
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        form: {
            session: session,
            type: '1'
        }
    };
    let res = yield req(opt);
    return res[1];
};

function sha1(str) {
    let crypto = require('crypto');
    let hash = crypto.createHash('sha1');
    hash.update(str);
    return hash.digest('hex');
}


//thunkify request method
function req(opt, callback) {
    return function (callback) {
        request(opt, callback);
    }
}
