/**
 * Created by MengLei on 2016-06-21.
 */
"use strict";
const model = require('../../model');

/**
 * 根据ID获取订单
 */
exports.getOrderById = function *(o_id) {
    return yield model.Order.findById(o_id);
};

/**
 * 根据给定查询条件获取订单列表
 * @param query
 * @param opt = {skip: '', limit: '', sort: ''}
 * @returns {*}
 */
exports.getOrdersByQuery = function *(query, opt) {
    return yield model.Order.find(query, {}, opt);
};

/**
 * 新建、编辑的订单
 * @param info
 */
exports.editOrder = function *(info) {
    let order = null;
    if (info.o_id) {
        order = yield model.Order.findById(info.o_id);
    }
    if (!order) {
        order = new (model.Order)();
    }
    order.price = info.price;
    order.userID = info.userID;
    order.topic_id = info.topic_id;
    order.expert_id = info.expert_id;
    order.question = info.question;
    order.duration = info.duration;
    order.self_desc = info.self_desc;
    return yield order.save();
};

/**
 * 获取用户订单列表
 * @param param = {status: [], start: '', limit: '', userID: '', expert_id: ''}
 * @returns {Array}
 */
exports.getList = function*(param) {
    let query = {status: {$ne: 'canceled'}};
    if (param.userID) {
        query['userID'] = param.userID;
    } else if (param.expert_id) {
        query['expert_id'] = param.expert_id;
    }
    if (param.status) {
        query['status'] = {$in: param.status};
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let orders = yield model.Order.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < orders.length; i++) {
        let item = {
            o_id: orders[i].o_id,
            userID: orders[i].userID,
            status: orders[i].status,
            rating: orders[i].rating
        };
        let res = yield [model.Topic.findById(orders[i].topic_id), model.User.findById(orders[i].expert_id), model.User.findById(orders[i].userID)];
        item.topic_info = yield res[0].toTopic();
        item.expert_info = yield res[1].toExpert(param.userID);
        item.user_info = res[2].toUser();
        if (item.status == 'rejected') {
            item.rejectReason = orders[i].rejectReason;
        }
        if (item.status == 'pending' || item.status == 'confirmed' || item.status == 'paid') {
            item.topic_info.category = res[0].category;
            let category = yield model.Category.findOne({categoryName: item.topic_info.category, type: 'category'});
            if (category) {
                item.banner = category.order_banner;
            } else {
                item.banner = '';
            }
        }
        list.push(item);
    }
    return list;
};

/**
 * 专家端获取订单列表
 * @param param
 * @returns {Array}
 */
exports.expertGetList = function *(param) {
    let query = {expert_id: param.expert_id, status: {$ne: 'canceled'}};
    if (param.status) {
        query['status'] = {$in: param.status};
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let orders = yield model.Order.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < orders.length; i++) {
        let item = {
            o_id: orders[i].o_id,
            userID: orders[i].userID,
            status: orders[i].status,
            question: orders[i].question,
            rating: orders[i].rating
        };
        let res = yield [model.Topic.findById(orders[i].topic_id), model.User.findById(orders[i].userID), model.User.findById(orders[i].expert_id)];
        item.topic_info = yield res[0].toTopic();
        item.user_info = res[1].toUser();
        item.expert_info = yield res[2].toExpert();
        list.push(item);
    }
    return list;
};

/**
 * 订单完成的一系列操作
 * @param param = {o_id: '', comment: '', stars: '', auto: ''}
 */
exports.onFinish = function *(param) {
    let order = yield model.Order.findById(param.o_id);
    if (!order) {
        return null;
    }
    order.commentAt = new Date();
    order.status = 'finished';
    if (param.auto) {
        order.auto = true;
        order.rating = 10;
    } else {
        order.comment = param.comment;
        order.rating = param.rating;
    }
    return yield [
        order.save(),
        require('./../user/user').incFinish({userID: order.expert_id, rating: order.rating}),
        require('./../other/money').orderFinished(order.o_id)
    ];
};

/**
 * 获取某一话题下的评论列表
 * @param param
 * @returns {Array}
 */
exports.getTopicCommentList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let orders = yield model.Order.find({
        topic_id: param.topic_id,
        commentAt: {$ne: null}
    }).sort({commentAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < orders.length; i++) {
        let item = {
            comment: orders[i].comment,
            rating: orders[i].rating,
            type: orders[i].type,
            commentAt: orders[i].commentAt,
            userID: orders[i].userID
        };
        let user = yield model.User.findById(item.userID);
        item.user_info = user.toUser();
        list.push(item);
    }
    return list;
};

/**
 * 获取某一专家收到的评论列表
 * @param param
 * @returns {Array}
 */
exports.getExpertCommentList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let orders = yield model.Order.find({
        expert_id: param.expert_id,
        comment: {$ne: ''},
        commentAt: {$ne: null}
    }).sort({commentAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < orders.length; i++) {
        let item = {
            comment: orders[i].comment,
            rating: orders[i].rating,
            type: orders[i].type,
            commentAt: orders[i].commentAt,
            userID: orders[i].userID,
            topic_id: orders[i].topic_id
        };
        if (orders[i].auto_finished) {
            item['auto_finished'] = true;
        }
        let res = yield [model.User.findById(item.userID), model.Topic.findById(item.topic_id)];
        item.user_info = res[0].toUser();
        item.topic_info = yield res[1].toTopic();
        list.push(item);
    }
    return list;
};


