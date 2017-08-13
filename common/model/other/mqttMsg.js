/**
 * Created by MengLei on 2016-06-30.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MqttMsgSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},     //msgid
    o_id: {type: Schema.Types.ObjectId},    //订单ID
    note_id: {type: Schema.Types.ObjectId}, //小纸条ID
    from: {type: Schema.Types.ObjectId},    //发送者
    to: {type: Schema.Types.ObjectId},      //接收者
    type: {type: String, default: 'order_chat'},    //消息类型
    expert: {type: Boolean},    //标识该消息是发给专家身份，仅chat
    read: {type: Boolean, default: false},
    content: {type: String},    //消息内容
    status: {type: String}      //订单或者小纸条状态
}, {timestamps: 1, read: 'sp'});

MqttMsgSchema.virtual('msgid').get(function () {
    return this._id.toString();
});

MqttMsgSchema.index({to: 1});
MqttMsgSchema.index({note_id: 1});
MqttMsgSchema.index({o_id: 1});
MqttMsgSchema.index({createdAt: 1}, {expireAfterSeconds: 86400 * 30});  //过期时间30天

mongoose.model('MqttMsg', MqttMsgSchema, 'mqttMsg');
