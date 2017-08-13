/**
 * Created by MengLei on 2016-06-21.
 */
"use strict";
const proxy = require('../../common/proxy');
const dateUtil = require('../../utils/date');
const ip = require('ip');
const ytx = require('../../utils/ytx');
const netease = require('../../utils/netease');
const ObjectID = require('mongoose').Types.ObjectId;
const pingpp_app_id = require('../../config').pingxx_config.app_id;
const pingpp = require('../../config').pingpp;

//话题预约
exports.create = function *(next) {
    if (!validator.isMongoId(this.params.topic_id)) {
        return result(this, {code: 904, msg: 'topic_id格式不正确！'}, 400);
    }
    if (!this.request.body.question) {
        return result(this, {code: 904, msg: '请输入问题内容！'}, 400);
    }
    if (!this.request.body.self_desc) {
        return result(this, {code: 904, msg: '请输入个人介绍！'}, 400);
    }
    let param = {
        userID: this.state.userID,
        topic_id: this.params.topic_id,
        question: this.request.body.question,
        self_desc: this.request.body.self_desc
    };
    let topic = yield proxy.Topic.getTopicById(param.topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: 'topic_id对应话题不存在！'}, 404);
    }
    if (topic.delete) {
        return result(this, {code: 911, msg: 'topic_id对应话题已删除！'}, 404);
    }
    if (topic.status != 'verified') {
        return result(this, {code: 911, msg: 'topic_id对应话题暂时不可用！'}, 404);
    }
    if (this.state.userID.toString() == topic.userID.toString()) {
        return result(this, {code: 910, msg: '用户无法向自己提问！'}, 400);
    }
    param['price'] = topic.price;
    param['expert_id'] = topic.userID;
    param['duration'] = topic.duration;
    let order = yield proxy.Order.editOrder(param);

    //状态改变的通知
    mqttSend(order.expert_id, 'order', {status: order.status, o_id: order.o_id});

    return result(this, {code: 900, o_id: order.o_id}, 201);
};

//获取订单详情
exports.get = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.userID.toString() != this.state.userID && order.expert_id.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法查看不是自己的订单！'}, 403);
    }
    let res = yield [proxy.User.getUserById(order.userID), proxy.User.getUserById(order.expert_id), proxy.Topic.getTopicById(order.topic_id), proxy.OrderCall.checkCall(order.o_id)];
    let info = order.toObject({getters: true});
    info.user_info = res[0].toUser();
    info.expert_info = yield res[1].toExpert(this.state.userID);
    info.topic_info = yield res[2].toTopic();
    info.called = res[3];
    yield proxy.MqttMsg.markOrder({o_id: order.o_id, userID: this.state.userID});  //将该订单的未读消息标为已读
    return result(this, {code: 900, info});
};

//取消订单
exports.delete = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.userID.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法取消不是自己的订单！'}, 403);
    }
    if (order.status != 'pending' && order.status != 'confirmed') {
        return result(this, {code: 910, msg: '订单状态不合法，无法取消！'}, 403);
    }
    order.status = 'canceled';
    order.cancelAt = new Date();
    order.cancelReason = this.request.body.reason || '';
    yield order.save();
    return result(this, {code: 900});
};

//获取订单列表
exports.getList = function *(next) {
    let param = {userID: this.state.userID};
    let body = this.request.query;
    if (body.status) {
        param['status'] = body.status.split(',');
    }
    if (body.start) {
        param['start'] = body.start;
    }
    if (body.page) {
        param['page'] = body.page;
    }
    if (body.limit) {
        param['limit'] = body.limit;
    }
    yield proxy.MqttMsg.markPoint({userID: param.userID, type: 'order', status: param.status});
    let list = yield proxy.Order.getList(param);
    return result(this, {code: 900, list});
};

//专家获取订单列表
exports.expertGetList = function *(next) {
    let param = {expert_id: this.state.userID};
    let body = this.request.query;
    if (body.status) {
        param['status'] = body.status.split(',');
    }
    if (body.start) {
        param['start'] = body.start;
    }
    if (body.page) {
        param['page'] = body.page;
    }
    if (body.limit) {
        param['limit'] = body.limit;
    }
    yield proxy.MqttMsg.markPoint({userID: param.userID, type: 'order', status: param.status});
    let list = yield proxy.Order.expertGetList(param);
    return result(this, {code: 900, list});
};

//专家确认订单
exports.confirm = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.expert_id.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法确认不是自己的订单！'}, 403);
    }
    if (order.status != 'pending') {
        return result(this, {code: 910, msg: '订单状态不合法，无法确认！'}, 403);
    }
    if (this.request.body.status == 'rejected') {
        order.status = 'rejected';
        order.rejectReason = this.request.body.reason || '';
        order.rejectAt = new Date();
    } else {
        order.status = 'confirmed';
        order.confirmAt = new Date();
    }
    yield order.save();

    //状态改变的通知
    mqttSend(order.userID, 'order', {o_id: order.o_id, status: order.status});

    return result(this, {code: 900});
};

//用户支付订单
exports.pay = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.userID.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法支付不是自己的订单！'}, 403);
    }
    if (order.status != 'confirmed') {
        return result(this, {code: 910, msg: '订单状态不合法，无法支付！'}, 403);
    }
    let pay_id = new ObjectID;
    let param = {
        pay_id: pay_id,
        userID: this.state.userID,
        expert_id: order.expert_id,
        o_id: order.o_id,
        type: 'order',
        channel: this.request.body.channel || 'alipay',
        amount: order.price,
        money: order.price,
        currency: this.request.body.currency || 'cny',
        subject: this.request.body.subject || `支付预约订单_${dateUtil.genDateStr()}`,
        desc: this.request.body.desc || ``
    };
    param.charge = yield doCharge({
        order_no: pay_id.toString(),
        app: {id: pingpp_app_id},
        channel: param.channel,
        amount: param.money,
        client_ip: ip.isV4Format(this.ip) ? this.ip : '127.0.0.1',
        currency: param.currency,
        subject: param.subject,
        body: `支付预约订单_${dateUtil.genDateStr()}_${pay_id.toString()}`,
        description: param.desc
    });
    let pay = yield proxy.Pay.createPay(param);
    return result(this, {code: 900, pay_id: pay.pay_id, charge: param.charge});
    //thunkify charge 方法
    function doCharge(p, callback) {
        return function (callback) {
            pingpp.charges.create(p, callback);
        }
    }
};

//发起电话呼叫
exports.call = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.status != 'paid') {
        return result(this, {code: 910, msg: '订单状态不合法，发起呼叫失败！'});
    }
    let check = yield proxy.OrderCall.checkCall(order.o_id);
    if (check) {
        return result(this, {code: 912, msg: '发起电话呼叫失败，之前已经呼叫过！'}, 400);
    }
    let res = yield [proxy.User.getUserById(order.userID), proxy.User.getUserById(order.expert_id)];
    let user = {
        userID: res[0].userID,
        phone: res[0].phone
    };
    let expert = {
        userID: res[1].userID,
        phone: res[1].phone
    };
    let param = {o_id: order.o_id, maxDur: order.duration ? order.duration.toString() : '60'};
    if (this.state.userID == user.userID) {
        param.caller = user.phone;
        param.callee = expert.phone;
        param.callerType = 'user';
    } else {
        param.caller = expert.phone;
        param.callee = user.phone;
        param.callerType = 'expert';
    }
    let callRes = yield netease.call(param);
    if (callRes.code == 200) {    //呼叫成功
        yield proxy.OrderCall.create({
            o_id: order.o_id,
            session: callRes.obj.session,
            caller: param.caller,
            callee: param.callee,
            callerType: param.callerType,
            createtime: param.createtime
        });
        return result(this, {code: 900, session: callRes.obj.session});
    } else if (callRes.code == 417) {
        return result(this, {code: 912, msg: '已经在呼叫中，请勿重复发起呼叫！'}, 400);
    } else {
        logger.error('yx error: ' + JSON.stringify(ytxRes));
        return result(this, {code: 912, msg: '发起电话呼叫失败，第三方服务错误！'}, 400);
    }
};

//确认订单完成
exports.finish = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.userID.toString() == this.state.userID) {
        if (order.status != 'paid' && order.status != 'toBeFinished') {
            return result(this, {code: 910, msg: '订单状态不合法，无法确认完成！'}, 403);
        }
        order.status = 'finished';
        order.finishAt = new Date();
    } else if (order.expert_id.toString() == this.state.userID) {
        if (order.status != 'paid') {
            return result(this, {code: 910, msg: '订单状态不合法，无法确认完成！'}, 403);
        }
        order.status = 'toBeFinished';
        order.finishAt = new Date();
    } else {
        return result(this, {code: 910, msg: '无法确认别人的订单！'}, 403);
    }

    //状态改变的通知
    mqttSend(order.userID, 'order', {o_id: order.o_id, status: order.status});

    yield order.save();
    return result(this, {code: 900});
};

//评价订单
exports.comment = function *(next) {
    if (!validator.isMongoId(this.params.o_id)) {
        return result(this, {code: 904, msg: 'o_id格式不正确！'}, 400);
    }
    if (!this.request.body.comment) {
        return result(this, {code: 904, msg: '请输入评价内容！'}, 400);
    }
    if (!this.request.body.rating) {
        return result(this, {code: 904, msg: '请选择星级！'}, 400);
    }
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    if (order.status != 'toBeFinished') {
        return result(this, {code: 910, msg: '订单状态不合法，无法评价！'}, 403);
    }
    if (order.commentAt) {
        return result(this, {code: 910, msg: '订单已评价过，无法再次评价！'}, 400);
    }
    yield proxy.Order.onFinish({
        o_id: order.o_id,
        comment: this.request.body.comment,
        rating: this.request.body.rating
    });

    //状态改变的通知
    mqttSend(order.expert_id, 'order', {o_id: order.o_id, status: 'finished'});

    return result(this, {code: 900});
};

//未读消息（离线期间收到的消息）
exports.unreadchat = function *(next) {
    let list = yield proxy.MqttMsg.getUnread(this.state.userID);
    return result(this, {code: 900, list});
};

//未读消息数
exports.unreadnum = function *(next) {
    let info = yield proxy.MqttMsg.getUnreadNum(this.state.userID);
    return result(this, {code: 900, info});
};

