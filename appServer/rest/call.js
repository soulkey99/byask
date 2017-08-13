/**
 * Created by MengLei on 2016-07-04.
 */
"use strict";
const ytx = require('../../utils/ytx');
const netease = require('../../utils/netease');

//容联云通讯，回拨webhook
exports.ytxhook = function *(next) {
    // console.log(this.header);
    // console.log(this.request.body);
    let body = this.request.body;
    let ytxCall = yield proxy.OrderCall.getCallBySession(body.calledCdr.callSid);
    if (!ytxCall) {
        return;
    }
    ytxCall.duration = body.calledCdr.duration;
    ytxCall.recordUrl = body.recordurl;
    ytxCall.calledCdr = body.calledCdr;
    ytxCall.callerCdr = body.callerCdr;
    ytxCall.status = 'finished';
    yield ytxCall.save();
    this.status = 200;
    this.body = 'OK';
};

//容联云通讯，回拨webhook
exports.ytxwebhook = function *(next) {
    console.log(this.header);
    console.log(this.params);
    console.log(this.request.body);
    console.log(this.is('text/xml'));
    switch (this.params.action) {
        case 'CallAuth':
            break;
        case 'CallEstablish':
            break;
        case 'Hangup':
            break;
    }
    if (this.params.action == 'CallAuth') {
        this.body = `<?xml version="1.0" encoding="UTF-8"?><Response><statuscode>0000</ statuscode ><statusmsg>状态描述信息</statusmsg><record>1</record></Response >`;
    } else {
        this.body = "ok";
    }
};

//网易云信webhook
exports.yxhook = function *(next) {
    this.body = "ok";
    // console.log('yxhook header: ' + JSON.stringify(this.header));
    // console.log('yxhook body: ' + JSON.stringify(this.request.body));
    if (process.env.NODE_ENV == 'production') { //transfer netease webhook for development
        let request = require('request');
        let opt = {
            url: 'http://test.soulkey99.com:8071/rest/call/yxhook',
            method: 'POST',
            headers: {
                'appkey': this.header['appkey'],
                'curtime': this.header['curtime'],
                'md5': this.header['md5'],
                'checksum': this.header['checksum']
            },
            json: true,
            body: this.request.body
        };
        request(opt, function () {
            console.log('transfer hook ok');
        });
        return;
    }
    let body = this.request.body;
    let call = yield proxy.OrderCall.getCallBySession(body.session);
    if (call) {
        call.duration = body.durationSec;
        call.legs = body.legs;
        call.status = body.status;
        if (body.recordUrl) {
            call.recordUrl = body.recordUrl;
        }
        call.starttime = body.starttime;
        yield call.save();
    }
};

//获取呼叫状态
exports.checkCall = function *(next) {
    let yxRes = yield netease.check(this.params.callSid);
    switch (yxRes.obj.status) {
        case 'INITED':
            break;
        case 'SUCCESS':
            break;
    }
};

