/**
 * Created by MengLei on 2016-07-04.
 */
"use strict";

const request = require('request');
const ytx = require('../config').ytx;
const log = require('./log');
const baseURL = 'https://app.cloopen.com:8883/2013-12-26';

//容联云通讯发起通话，param={userID: '发起者userID', caller: '主叫号码', callee: '被叫号码',
//customerSerNum: '被叫侧显示号码', fromSerNum: '主叫侧显示号码', promptTone: '回拨提示音',
//alwaysPlay: '是否一直播放提示音', userData: '私有数据', duration: '呼叫限制时长', cbUrl: '话单回调', 
//}
exports.ytxcall = function *(param) {
    let ts = getTs();
    let opt = {
        url: `${baseURL}/SubAccounts/${ytx.subAccountSid}/Calls/Callback?sig=${getSig(ytx.subAccountSid, ytx.subToken, ts)}`,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': getAuth(ytx.subAccountSid, ts)
        },
        body: {
            "to": param.callee,
            "from": param.caller,
            "userData": param.o_id,
            "maxCallTime": '60',
            "recordPoint": "0",
            "hangupCdrUrl": process.NODE_ENV == 'production' ? "http://callcall.soulkey99.com:8071/rest/call/ytxhook" : "http://test.soulkey99.com:8071/rest/call/ytxhook",
            "needBothCdr": "1",
            "needRecord": "1",
            "countDownTime": "30",
            "cbContenType": "json"
        }
    };
    let res = yield req(opt);
    return res[1];
};

//云通讯取消呼叫，callSid
exports.ytxcancel = function *(callSid) {
    let ts = getTs();
    let opt = {
        url: `${baseURL}/SubAccounts/${ytx.subAccountSid}/Calls/CallCancel?sig=${getSig(ytx.subAccountSid, ytx.subToken, ts)}`,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': getAuth(ytx.subAccountSid, ts)
        },
        body: {
            appId: ytx.appID,
            callSid: callSid
        }
    };
    let res = yield req(opt);
    return res[1];
};

//获取通讯状态
exports.ytxStatus = function *(callSid) {
    let ts = getTs();
    let opt = {
        url: `${baseURL}/Accounts/${ytx.accountSid}/ivr/call?sig=${getSig(ytx.accountSid, ytx.authToken, ts)}`,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': getAuth(ytx.accountSid, ts)
        },
        body: {
            Appid: ytx.appID,
            callid: callSid
        }
    };
    let res = yield req(opt);
    return res[1];
};

//获取通讯结果
exports.ytxResult = function *(callSid) {
    let ts = getTs();
    let opt = {
        url: `${baseURL}/Accounts/${ytx.accountSid}/CallResult?sig=${getSig(ytx.accountSid, ytx.authToken, ts)}&callsid=${callSid}`,
        method: 'GET',
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': getAuth(ytx.accountSid, ts)
        }
    };
    let res = yield req(opt);
    return res[1];
};

//获取云通讯话单
exports.ytxBill = function *() {
    let ts = getTs();
    let opt = {
        url: `${baseURL}/Accounts/${ytx.accountSid}/BillRecords?sig=${getSig(ytx.accountSid, ytx.authToken, ts)}`,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': getAuth(ytx.accountSid, ts)
        },
        body: {
            appId: ytx.appID,
            date: 'day'
        }
    };
    let res = yield req(opt);
    return res[1];
};

//获取容联云通讯子帐号信息
exports.getSubAccounts = function *() {
    let ts = getTs();
    let opt = {
        url: `${baseURL}/Accounts/${ytx.accountSid}/GetSubAccounts?sig=${getSig(ytx.accountSid, ytx.authToken, ts)}`,
        method: 'POST',
        json: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': getAuth(ytx.accountSid, ts)
        },
        body: {
            appId: ytx.appID
        }
    };
    let res = yield req(opt);
    return res[1];
};


function getAuth(id, ts) {
    return (new Buffer(`${id}:${ts}`, 'utf8')).toString('base64');
}

function getSig(id, token, ts) {
    return require('crypto').createHash('md5').update(`${id}${token}${ts}`).digest('hex').toUpperCase();
}

function getTs() {
    let curDate = new Date();
    let month = (curDate.getMonth() + 1).toString();
    let date = curDate.getDate().toString();
    let hour = (curDate.getHours()).toString();
    let minute = (curDate.getMinutes()).toString();
    let second = (curDate.getSeconds()).toString();
    return `${curDate.getFullYear().toString()}${month.length < 2 ? '0' + month : month}${date.length < 2 ? '0' + date : date}${hour.length < 2 ? ( '0' + hour) : hour}${minute.length < 2 ? ( '0' + minute) : minute}${second.length < 2 ? ( '0' + second) : second}`;
}

//thunkify request method
function req(opt, callback) {
    return function (callback) {
        request(opt, callback);
    }
}
