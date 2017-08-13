/**
 * Created by MengLei on 2016-06-29.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let MqttSchema = new Schema({
    //{"clientid":"paho-17443832999082","username":"560ba4eb5a83a29c23fd142f","ipaddress":"127.0.0.1","session":true,"protocol":4,"connack":0,"ts":1467183777}
    _id: {type: Schema.Types.ObjectId},
    platform: {type: String, default: 'android'},
    online: {type: Boolean, default: true},
    clientid: {type: String},
    username: {type: String},
    ipaddress: {type: String},
    session: {type: Boolean},
    protocol: {type: Number},
    reason: {type: String},
    connack: {type: Number},
    ts: {type: Number}
}, {
    timestamps: 1
});

MqttSchema.index({clientid: 1});
MqttSchema.index({updatedAt: 1}, {expireAfterSeconds: 604800});  //过期时间7天

mongoose.model('MqttUser', MqttSchema, 'userMqtt');
