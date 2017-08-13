/**
 * Created by MengLei on 2016-07-07.
 */
"use strict";
const mqtt = require('mqtt');
const co = require('co');
const umeng = require('./../../utils/umeng');
const ObjectId = require('mongoose').Types.ObjectId;

let opt = {
    keepalive: 30,
    clean: false,
    reconnectPeriod: 3000,
    clientId: 'sktalent-adminserver',
    username: 'sktalent'
};

let server = mqtt.connect('mqtt://127.0.0.1:1883', opt);
let timer = null;

server.on('connect', onConnected);
server.on('message', onMessage);
server.on('error', onError);

function onConnected() {
    logger.fatal(`mqtt client for admin server connected.`);
    clearTimeout(timer);
}

function onError(err) {
    logger.error(`mqtt client for admin server connect error: ` + err.message);
    timer = setTimeout(function () {
        server = mqtt.connect('mqtt://127.0.0.1:8075', opt);
        server.on('connect', onConnected);
        server.on('message', onMessage);
        server.on('error', onError);
    }, 3000);
}
function onMessage(topic, msg) {
    //
}

/**
 * 通过mqtt向客户端发送通知
 * @param {String} to 接收者ID
 * @param {String} type 通知类型，note：小纸条，order：订单，feedback：反馈
 * @param {Object} payload = {status: '', o_id: '', note_id: ''}
 */
exports.sendTo = function (to, type, payload) {
    to = to.toString();
    logger.trace(`mqtt client for admin server send msg, dest: ${to}, type: ${type}, payload: ${JSON.stringify(payload)}`);
    co(proxy.MqttUser.check(to)).then(check=> {
        let msgid = ObjectId().toString();  //msgid
        switch (type) {
            case 'feedback':
                proxy.MqttMsg.onSent2({
                    msgid,
                    to,
                    type,
                    content: payload.content
                });
                break;
            case 'expert':
                proxy.MqttMsg.onSent2({
                    msgid,
                    to,
                    type,
                    status: payload.status
                });
                break;
        }
        if (check && check.online) {
            server.publish(
                `$sktalent/clients/${to}`,  //目标topic
                JSON.stringify({msgid, to, type, payload}), //消息内容
                {qos: 2, retain: true},     //options
                function () {   //默认加一个空回调
                });
        } else {
            if (check) {
                umeng({dest: to, platform: check.platform, type: type, payload});
            }
        }
    }, err=> {
        logger.error(`send mqtt error: ${err.message}`);
    });
};

