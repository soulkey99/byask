/**
 * Created by MengLei on 2016-06-30.
 */
"use strict";
const model = require('../../model');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * 记录聊天消息
 * @param param = {msgid: '', from: '', to: '', o_id: '', content: '', type: ''}
 */
exports.onSent = function*(param) {
    let msg = new (model.MqttMsg)();
    msg._id = param.msgid;
    msg.from = param.from;
    msg.to = param.to;
    msg.o_id = param.o_id;
    msg.note_id = param.note_id;
    msg.content = param.content;
    msg.status = param.status;
    msg.expert = param.expert;
    if (param.type) {
        msg.type = param.type;
    }
    return yield msg.save();
};
exports.onSent2 = function (param) {    //同样的方法，只是没有generator
    let msg = new (model.MqttMsg)();
    msg._id = param.msgid;
    msg.from = param.from;
    msg.to = param.to;
    msg.o_id = param.o_id;
    msg.note_id = param.note_id;
    msg.content = param.content;
    msg.status = param.status;
    if (param.type) {
        msg.type = param.type;
    }
    msg.save();
    return msg;
};
/**
 * 标记消息已读
 * @param msgid
 */
exports.onRead = function (msgid) {
    model.MqttMsg.findByIdAndUpdate(msgid, {$set: {read: true}}).exec();
};

/**
 * 获取首页小红点数据
 * @param userID
 * @returns {*}
 */
exports.point = function *(userID) {
    if (typeof userID == 'string') {
        userID = ObjectId(userID)
    }
    let res = yield [
        model.MqttMsg.count({to: userID, read: false, type: 'order_chat', expert: true}),
        model.MqttMsg.count({to: userID, read: false, type: 'order_chat', expert: false}),
        model.MqttMsg.count({to: userID, read: false, type: 'note', status: 'paid'}),
        model.MqttMsg.count({to: userID, read: false, type: 'note', status: 'replied'}),
        model.MqttMsg.aggregate([{
            $match: {to: userID, read: false, type: 'order_chat', expert: true}
        }, {$group: {_id: '$o_id', count: {$sum: 1}}}]).exec(),
        model.MqttMsg.aggregate([{
            $match: {to: userID, read: false, type: 'order_chat', expert: false}
        }, {$group: {_id: '$o_id', count: {$sum: 1}}}]).exec(),
        model.MqttMsg.count({to: userID, read: false, type: 'feedback'}),
        model.MqttMsg.count({to: userID, read: false, type: 'expert'})
    ];
    let list1 = [];
    res[4].forEach(item=> {
        list1.push({o_id: item._id.toString(), count: item.count});
    });
    let list2 = [];
    res[5].forEach(item=> {
        list2.push({o_id: item._id.toString(), count: item.count});
    });
    return {
        user: {     //用户端
            order_chat: res[1],     //未读消息数
            chat_list: list2,       //分订单未读消息数
            note_replied: res[3],   //小纸条被回复数
            feedback: res[6]        //新的意见反馈回复消息
        },
        expert: {   //专家端
            order_chat: res[0],     //未读消息数
            chat_list: list1,       //分订单未读消息数
            note_paid: res[2],      //新的小纸条提问数
            expert: res[7]          //新的专家审核通过消息
        }
    };
};

/**
 * 获取未读消息列表
 * @param userID
 * @returns {Array}
 */
exports.getUnread = function *(userID) {
    let msgs = yield model.MqttMsg.find({to: userID, read: false, type: 'order_chat'}).sort({createdAt: -1});
    let oids = {};
    for (let i = 0; i < msgs.length; i++) {
        if (!oids[msgs[i].o_id.toString()]) {
            oids[msgs[i].o_id.toString()] = [{
                msgid: msgs[i].msgid,
                from: msgs[i].from,
                to: msgs[i].to,
                content: msgs[i].content,
                createdAt: msgs[i].createdAt
            }];
        } else {
            oids[msgs[i].o_id.toString()].push({
                msgid: msgs[i].msgid,
                from: msgs[i].from,
                to: msgs[i].to,
                content: msgs[i].content,
                createdAt: msgs[i].createdAt
            });
        }
    }
    let list = [];
    let keys = Object.keys(oids);
    keys.forEach(item=> {
        list.push({
            o_id: item,
            list: oids[item]
        });
    });
    return list;
};

/**
 * 将指定订单发给指定用户的未读消息标为已读
 * @param param = {o_id: '', userID: ''}
 * @returns {*}
 */
exports.markOrder = function*(param) {
    return yield model.MqttMsg.update({
        o_id: param.o_id,
        to: param.userID,
        type: 'order_chat'
    }, {$set: {read: true}}, {multi: true});
};

/**
 * 标记红点已读
 * @param param = {type: '', userID: '', status: ''}
 * @returns {*}
 */
exports.markPoint = function*(param) {
    let query = {to: param.userID, type: param.type, read: false};
    if (param.status) {
        query['status'] = {$in: param.status};
    }
    return yield model.MqttMsg.update(query, {$set: {read: true}}, {multi: true});
};

exports.getUnreadNum = function *(userID) {
    if (typeof userID == 'string') {
        userID = ObjectId(userID)
    }
    let res = yield model.MqttMsg.aggregate([{
        $match: {
            read: false,
            to: userID,
            type: 'order_chat'
        }
    }, {$group: {_id: '$o_id', count: {$sum: 1}}}]).exec();
    let list = [];
    let total = 0;
    res.forEach(item=> {
        total += item.count;
        list.push({o_id: item._id.toString(), count: item.count});
    });
    return {total, list};
};
