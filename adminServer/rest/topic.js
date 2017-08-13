/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";

//获取话题分类配置
exports.getCategory = function *(next) {
    let list = yield proxy.Category.getCategoryList(this.params.categoryName);
    return result(this, {code: 900, list});
};

//获取指定用户的话题列表
exports.getList = function*(next) {
    let body = this.request.query;
    let param = {expert_id: this.params.userID};
    if (body.start) {
        param['start'] = this.request.query.start;
    }
    if (body.page) {
        param['page'] = this.request.query.page;
    }
    if (body.limit) {
        param['limit'] = this.request.query.limit;
    }
    if (body.delete != 'true') {
        param['delete'] = false;
    }
    if (body.status) {
        param['status'] = body.status;
    }
    let list = yield proxy.Topic.getUserTopicList(param);
    return result(this, {code: 900, list});
};

//新建话题
exports.create = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.params.userID,
        category: body.category,
        subCategory: body.subCategory,
        type: body.type || 'phone',
        title: body.title,
        summary: body.summary,
        description: body.description,
        price: Number.parseInt(body.price || '0'),
        duration: Number.parseInt(body.duration || '60'),
        tags: []
    };
    if (body.tags) {
        param.tags = body.tags.split(',');
    }
    let topic = yield proxy.Topic.editTopic(param);
    return result(this, {code: 900, topic_id: topic.topic_id}, 201);
};

//编辑话题
exports.edit = function*(next) {
    let body = this.request.body;
    let topic = yield proxy.Topic.getTopicById(this.params.topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: '对应的话题不存在！'}, 404);
    }
    if (body.category != undefined) {
        topic.category = body.category;
    }
    if (body.subCategory != undefined) {
        topic.subCategory = body.subCategory;
    }
    if (body.type != undefined) {
        topic.type = body.type;
    }
    if (body.title != undefined) {
        topic.title = body.title;
    }
    if (body.summary != undefined) {
        topic.summary = body.summary;
    }
    if (body.description != undefined) {
        topic.description = body.description;
    }
    if (body.price != undefined) {
        topic.price = Number.parseInt(body.price);
    }
    if (body.duration != undefined) {
        topic.duration = Number.parseInt(body.duration);
    }
    if (body.status != undefined) {
        topic.status = body.status;
    }
    if (body.delete != undefined) {
        topic.delete = body.delete == 'true';
    }
    if (body.tags != undefined) {
        if (body.tags) {
            topic.tags = body.tags.split(',');
        } else {
            topic.tags = [];
        }
    }
    yield topic.save();
    return result(this, {code: 900, topic_id: topic.topic_id});
};


//获取订单列表
exports.getOrderList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit,
        type: body.type
    };
    if (body.phone) {
        let user = yield proxy.User.getUserByPhone(body.phone);
        if (user) {
            body.userID = user.userID;
        } else {
            return result(this, {code: 900, list: []});
        }
    }
    if (body.userID) {
        if (body.type == 'expert') {
            param['expert_id'] = body.userID;
        } else {
            param['userID'] = body.userID;
        }
    }
    if (body.status) {
        param['status'] = body.status.split(',');
    }
    let list = yield proxy.Order.getList(param);
    return result(this, {code: 900, list});
};

//获取订单详情
exports.getOrderDetail = function*(next) {
    let order = yield proxy.Order.getOrderById(this.params.o_id);
    if (!order) {
        return result(this, {code: 911, msg: '订单不存在！'}, 404);
    }
    let res = yield [proxy.User.getUserById(order.userID), proxy.User.getUserById(order.expert_id), proxy.Topic.getTopicById(order.topic_id), proxy.OrderCall.checkCall(order.o_id)];
    let info = order.toObject({getters: true});
    info.user_info = res[0].toUser();
    info.expert_info = yield res[1].toExpert(this.state.userID);
    info.topic_info = yield res[2].toTopic();
    info.called = res[3];
    return result(this, {code: 900, info});
};

//获取小纸条列表
exports.getNoteList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit,
        type: body.type
    };
    if (body.phone) {
        let user = yield proxy.User.getUserByPhone(body.phone);
        if (user) {
            body.userID = user.userID;
        } else {
            return result(this, {code: 900, list: []});
        }
    }
    if (body.userID) {
        if (body.type == 'expert') {
            param['expert_id'] = body.userID;
        } else {
            param['userID'] = body.userID;
        }
    }
    if (body.status) {
        param['status'] = body.status.split(',');
    }
    let list = yield proxy.Note.getAdminList(param);
    return result(this, {code: 900, list});
};

//获取小纸条详情
exports.getNoteDetail = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    let info = note.toObject({getters: true});
    info.ups = note.ups.length;
    info.listen = note.list.length;
    let res = yield [proxy.User.getUserById(info.userID), proxy.User.getUserById(info.expert_id)];
    info.user_info = res[0].toUser();
    info.expert_info = yield res[1].toExpert();
    return result(this, {code: 900, info});
};

