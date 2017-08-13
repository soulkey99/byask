/**
 * Created by MengLei on 2016-07-01.
 */
"use strict";
const umeng = require('./../config').umeng;
const proxy = require('./../common/proxy');
const log = require('./../utils/log').umeng;

//param = {dest: '', platform: '', type: '', payload: {o_id: '', content: '', expert: ''}}
module.exports = function (param) {
    if (param.platform == 'ios') {
        iosPush(param);
    } else if (param.platform == 'android') {
        androidPush(param);
    } else {
        androidPush(param);
        iosPush(param);
    }
};

function iosPush(param) {
    let body = {
        aps: {
            alert: '',
            sound: 'default'
        }
    };
    switch (param.type) {
        case 'order_chat': {
            body['action'] = 'order_chat';
            body['o_id'] = param.payload.o_id;
            body['expert'] = param.payload.expert;
            body.aps.alert = param.payload.content;
        }
            break;
        case 'order': {   //订单相关通知
            body['action'] = 'order';
            body['o_id'] = param.payload.o_id;
            body['status'] = param.payload.status;
            switch (param.payload.status) {
                case 'pending':
                    body.aps.alert = '您有新的预约！';
                    break;
                case 'confirmed':
                    body.aps.alert = '专家已经接受了你的预约，请尽快支付！';
                    break;
                case 'paid':
                    body.aps.alert = '用户已经支付成功，请开始沟通！';
                    break;
                case 'toBeFinished':
                    body.aps.alert = '专家已经结束本次预约，请对专家进行评价！';
                    break;
                case 'finished':
                    body.aps.alert = '用户已经完成对你的评价！';
                    break;
                case 'rejected':
                    body.aps.alert = '专家已经拒绝了你的预约！';
                    break;
                default:
                    return;
                    break;
            }
        }
            break;
        case 'note': {  //小纸条相关通知
            body['action'] = 'note';
            body['note_id'] = param.payload.note_id;
            body['status'] = param.payload.status;
            switch (param.payload.status) {
                case 'paid':
                    body.aps.alert = '你有新的纸条，请及时回复！';
                    break;
                case 'replied':
                    body.aps.alert = '专家已经回复了你的纸条！';
                    break;
                default:
                    return;
                    break;
            }
        }
            break;
        case 'feedback':
            body['action'] = 'feedback';
            body.aps.alert = '问达客服专员回复了您：' + param.payload.content;
            break;
        default:
            return;
            break;
    }
    let push = {
        type: 'customizedcast',
        alias_type: 'calltalent',
        alias: param.dest,
        payload: {
            body: body
        },
        production_mode: process.env.NODE_ENV == 'production' ? 'true' : 'false'
    };
    umeng.iosPush(push)
        .then(data=>log.trace(`umeng push to ios ${param.dest} success: ` + JSON.stringify(data)))
        .catch(err=>log.trace(`umeng push to ios error: ${err.message}`))
        .finally();
}

function androidPush(param) {
    let body = {
        ticker: '问答CallTalent，您有一条新消息！',
        title: '问答CallTalent',
        text: '',
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
    switch (param.type) {
        case 'msg':
            body.text = param.payload.content;
            body.after_open = 'go_app';
            break;
        case 'order': {   //订单相关通知
            body['action'] = 'order';
            body['o_id'] = param.payload.o_id;
            switch (param.payload.status) {
                case 'pending':
                    body.text = '您有新的预约！';
                    break;
                case 'confirmed':
                    body.text = '专家已经接受了你的预约，请尽快支付！';
                    break;
                case 'paid':
                    body.text = '用户已经支付成功，请开始沟通！';
                    break;
                case 'toBeFinished':
                    body.text = '专家已经结束本次预约，请对专家进行评！';
                    break;
                case 'finished':
                    body.text = '用户已经完成对你的评价！';
                    break;
                case 'rejected':
                    body.text = '专家已经拒绝了你的预约！';
                    break;
                default:
                    return;
                    break;
            }
        }
            break;
        case 'note': {  //小纸条相关通知
            switch (param.payload.status) {
                case 'paid':
                    body.text = '你有新的纸条，请及时回复！';
                    break;
                case 'replied':
                    body.text = '专家已经回复了你的纸条！';
                    break;
                default:
                    return;
                    break;
            }
        }
            break;
        case 'feedback':
            body.ticker = '问达客服专员回复了您';
            body.text = '问达客服专员' + body.payload.content;
            break;
        default:
            return;
            break;
    }

    let push = {
        type: 'customizedcast',
        alias_type: 'calltalent',
        alias: param.dest,
        display_type: 'notification',
        body: body,
        extra: extra,
        policy: policy,
        production_mode: process.env.NODE_ENV == 'production' ? 'true' : 'false'
    };
    umeng.androidPush(push)
        .then(data=>log.trace(`umeng push to android ${param.dest} success: ` + JSON.stringify(data)))
        .catch(err=>log.trace(`umeng push to android error: ${err.message}`))
        .finally();
}
