/**
 * Created by MengLei on 2016-06-29.
 */
"use strict";
const proxy = require('../../common/proxy');
const co = require('co');
const umeng = require('./../../utils/umeng');
const client = require('../client/client');
const chat = require('./orderChat');

exports.onMsg = function (msg) {
    switch (msg.type) {
        case 'order_chat':
            chat.onChat(msg);
            break;
        case 'received':
            onReceived(msg);
            break;
            break;
    }
};

exports.onSend = function (dest, msg) {
    co(function *() {
        let check = yield proxy.MqttUser.check(dest);
        if (check && check.online) { //在线走mqtt通道
            client.sendTo(dest, msg);
        } else {  //离线走友盟通道
            msg.platform = check.platform;
            umengPush(msg);
        }
    }).then(resp=> {
    }, err=> {
        logger.error(`error: ${err.message}`)
    });
};

function onReceived(msg) {
    client.sendTo(msg.to, msg);
    proxy.MqttMsg.onRead(msg.msgid);
}

function umengPush(msg) {
    let info = {
        dest: dest,
        platform: msg.platform,
        type: '',
        payload: {}
    };
    switch (msg.type) {
        case 'order_chat':
            info.type = 'order_chat';
            info.payload = {
                expert: msg.payload.expert,
                o_id: msg.payload.o_id,
                content: msg.payload.content
            };
            break;
    }
    umeng(info);
}

