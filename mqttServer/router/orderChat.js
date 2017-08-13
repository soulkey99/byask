/**
 * Created by MengLei on 2016-06-29.
 */
"use strict";
const proxy = require('../../common/proxy');
const router = require('./');
const co = require('co');

exports.onChat = function (msg) {
    if (msg.payload) {
        msg.payload.t = new Date();
    } else {
        return;
    }
    co(function *() {
        let order = yield proxy.Order.getOrderById(msg.payload.o_id);
        msg.payload.expert = msg.to == order.expert_id.toString();
        if (!order) {
            return;
        }
        order.chat.push({
            _id: msg.msgid,
            from: msg.from,
            to: msg.to,
            content: msg.payload.content
        });
        return yield [
            order.save(),
            proxy.MqttMsg.onSent({
                msgid: msg.msgid,
                from: msg.from,
                to: msg.to,
                expert: msg.payload.expert,
                o_id: msg.payload.o_id,
                content: msg.payload.content
            })];
    }).then(resp=> {
        logger.trace('save to db success, send msg to dest.');
        router.onSend(msg.to, msg); //保存成功，将消息转发给接收者
        router.onSend(msg.from, {msgid: msg.msgid, type: 'sent'});  //通知发送者一个确认消息
    }, err=> {
        logger.error(`on chat error: ${err.message}`)
    });
};

