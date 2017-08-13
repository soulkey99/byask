/**
 * Created by MengLei on 2016-08-24.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let WXMsgSchema = new Schema({
    //['ToUserName', 'FromUserName', 'CreateTime', 'MsgType', 'Content', 'MsgId', 'PicUrl', 'MediaId', 'Format', 'Recognition', 'ThumbMediaId', 'Location_X', 'Location_Y', 'Scale', 'Label', 'Description', 'Url'];
    _id: {type: String},
    toUserName: {type: String, required: true},
    fromUserName: {type: String, required: true},
    msgType: {type: String, required: true},//消息类型，text：文字消息，voice：语音消息，video：视频消息，shortvideo：小视频消息，location：位置消息，link：链接消息，event：推送事件
    event: {type: String},//事件类型：subscribe/unsubscribe：订阅、取消订阅，SCAN：已关注用户扫描二维码，LOCATION：上报地理位置，CLICK：点击菜单，VIEW：点击菜单跳转链接事件
    eventKey: {type: String},//事件的key值，
    ticket: {type: String}, //二维码的ticket，可以用于换取二维码
    createTime: {type: Date, required: true},
    content: {type: String},
    picUrl: {type: String},
    mediaId: {type: String},
    format: {type: String},
    recognition: {type: String},
    thumbMediaId: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    precision: {type: Number},
    location_X: {type: Number},
    location_Y: {type: Number},
    scale: {type: Number},
    label: {type: String}
}, {timestamps: 1});

WXMsgSchema.plugin(BaseModel);

WXMsgSchema.virtual('msgId').get(function () {
    return this._id.toString();
});

mongoose.model('WXMsg', WXMsgSchema, 'wxmsg');