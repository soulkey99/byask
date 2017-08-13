/**
 * Created by MengLei on 2016-06-29.
 */
"use strict";
const mqtt = require('mqtt');
const proxy = require('../../common/proxy');
const router = require('../router');
const co = require('co');

let opt = {
    keepalive: 30,
    clean: false,
    reconnectPeriod: 3000,
    clientId: 'sktalent-server',
    username: 'sktalent'
};

let server = mqtt.connect('mqtt://127.0.0.1:1883', opt);
let timer = null;

server.on('connect', onConnected);
server.on('message', onMessage);
server.on('error', onError);

function onConnected() {
    console.log('mqtt server connected.');
    logger.fatal(`mqtt server connected.`);
    server.subscribe('$SYS/brokers/+/clients/#');
    server.subscribe('$sktalent/server/mqttserver');
    clearTimeout(timer);
}

function onError(err) {
    logger.error(`mqtt server connect error: ` + err.message);
    timer = setTimeout(function () {
        server = mqtt.connect('mqtt://127.0.0.1:8075', opt);
        server.on('connect', onConnected);
        server.on('message', onMessage);
        server.on('error', onError);
    }, 3000);
}
function onMessage(topic, msg) {
    logger.trace(`mqtt msg: ${msg.toString()}, topic: ${topic}`);
    let param = {};
    try {
        param = JSON.parse(msg.toString());
    } catch (ex) {
        logger.error(`parse json msg error: ${ex.message}`);
        return;
    }
    if (topic == '$sktalent/server/mqttserver') {
        //只有发往byserver的消息才转发给router处理
        msg.t = new Date();
        router.onMsg(param);
    } else if (/^\$SYS\/brokers\/.*\/clients\/.*\/connected$/.test(topic)) {
        if (param.username != "sktalent") {
            co(proxy.MqttUser.connected(param)).then(resp=>logger.trace('connected resp: ' + JSON.stringify(resp)), err=>logger.error('connected error: ' + err.message));
        }
        logger.trace('connected.' + msg.toString());
    } else if (/^\$SYS\/brokers\/.*\/clients\/.*\/disconnected$/.test(topic)) {
        if (param.username != "sktalent") {
            co(proxy.MqttUser.disconnected(param)).then(resp=>logger.trace('disconnected resp: ' + JSON.stringify(resp)), err=>logger.error('disconnected error: ' + err.message));
        }
        logger.trace('disconnected.' + msg.toString());
    }
}

exports.sendTo = function (dest, msg) {
    logger.trace(`send msg: ${msg}, dest: ${dest}`);
    server.publish(`$sktalent/clients/${dest}`, JSON.stringify(msg), {qos: 2, retain: true}, function () {
        //
    });
};

