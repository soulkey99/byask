/**
 * Created by MengLei on 2016-06-29.
 */
"use strict";
const model = require('../../model');

//{"clientid":"paho-17443832999082","username":"560ba4eb5a83a29c23fd142f","ipaddress":"127.0.0.1","session":true,"protocol":4,"connack":0,"ts":1467183777}
exports.connected = function *(param) {
    let mqtt = yield model.MqttUser.findById(param.username);
    if (!mqtt) {
        mqtt = new (model.MqttUser)();
        mqtt._id = param.username;
    }
    mqtt.clientid = param.clientid;
    yield model.MqttUser.remove({clientid: param.clientid, _id: {$ne: param.username}});
    // mqtt._id = param.username;
    mqtt.ipaddress = param.ipaddress;
    mqtt.session = param.session;
    mqtt.online = true;
    mqtt.protocol = param.protocol;
    mqtt.connack = param.connack;
    mqtt.ts = param.ts;
    return yield mqtt.save();
};

/**
 * 用户登录时，记录操作系统平台
 * @param param
 * @returns {*}
 */
exports.onLogin = function *(param) {
    let mqtt = yield model.MqttUser.findById(param.userID);
    if (!mqtt) {
        mqtt = new (model.MqttUser)();
        mqtt._id = param.userID;
    }
    mqtt.platform = param.platform;
    return yield mqtt.save();
};

/**
 * mqtt注销
 * @param param = {clientid: '', reason: ''}
 * @returns {*}
 */
exports.disconnected = function *(param) {
    let mqtt = yield model.MqttUser.findOne({clientid: param.clientid});
    if (!mqtt) {
        return;
    }
    mqtt.online = false;
    mqtt.reason = param.reason;
    return yield mqtt.save();
};

exports.check = function *(userID) {
    let mqtt = yield model.MqttUser.findById(userID);
    return {online: mqtt.online, platform: mqtt.platform};
};


