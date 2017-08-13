/**
 * Created by MengLei on 2016-06-20.
 */
"use strict";

//创建话题
exports.create = function *(next) {
    let body = this.request.body;
    if (this.state.user.expertInfo.status != 'verified') {
        return result(this, {code: 910, msg: '只有达人身份才能创建话题！'}, 400);
    }
    let param = {
        userID: this.state.userID,
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

//创建话题时使用的可用分类列表
exports.categories = function *(next) {
    let list = yield proxy.Category.getCategoryList(this.params.categoryName);
    return result(this, {code: 900, list});
};

//修改话题
exports.update = function *(next) {

};

//删除话题
exports.delete = function *(next) {
    let topic_id = this.params.topic_id;
    let topic = yield proxy.Topic.getTopicById(topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: '话题不存在！'}, 404);
    }
    if (topic.userID.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法操作不是自己的话题！'}, 403);
    }
    topic.delete = true;
    yield topic.save();
    return result(this, {code: 900, topic_id: topic.topic_id});
};

//关闭话题
exports.close = function *(next) {
    let topic_id = this.params.topic_id;
    let topic = yield proxy.Topic.getTopicById(topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: '话题不存在！'}, 404);
    }
    if (topic.userID.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法操作不是自己的话题！'}, 403);
    }
    if (topic.status == 'verified') {
        topic.status = 'closed';
    } else if (topic.status == 'closed') {
        topic.status = 'verified';
    } else {
        return result(this, {code: 910, msg: '话题状态不合法，无法操作！'});
    }
    yield topic.save();
    return result(this, {code: 900, topic_id: topic.topic_id, status: topic.status});
};

//获取指定用户的话题列表
exports.getUserTopicList = function *(next) {
    let param = {userID: this.state.userID};
    if (this.params.userID) {
        param['expert_id'] = this.params.userID;
    } else {
        param['expert_id'] = this.state.userID;
    }
    if (this.request.query.start) {
        param['start'] = this.request.query.start;
    }
    if (this.request.query.page) {
        param['page'] = this.request.query.page;
    }
    if (this.request.query.limit) {
        param['limit'] = this.request.query.limit;
    }
    if (param.userID == param.expert_id) {//只针对获取用户自己的话题列表
        if (this.request.query.delete != 'true') {//如果没传delete=true，那么只获取未删除的部分
            param['delete'] = false;
        }
        if (this.request.query.status == 'all') {//如果没传status=all，那么只获取已审核通过的部分
            delete(param.status);
        } else {
            param['status'] = 'verified';
        }
    } else {    //针对获取其他用户话题列表，只能获取已审核通过并且未删除的
        param['status'] = 'verified';
        param['delete'] = false;
    }
    let list = yield proxy.Topic.getUserTopicList(param);
    return result(this, {code: 900, list});
};

//获取话题列表
exports.getList = function *(next) {
    let param = {};
    if (this.state.userID) {
        param['userID'] = this.state.userID;
    }
    if (this.params.categoryName) {
        param['category'] = this.params.categoryName;
    }
    if (this.request.query.start) {
        param['start'] = this.request.query.start;
    }
    if (this.request.query.page) {
        param['page'] = this.request.query.page;
    }
    if (this.request.query.limit) {
        param['limit'] = this.request.query.limit;
    }
    let list = yield proxy.Topic.getList(param);
    return result(this, {code: 900, list});
};

//获取话题详情
exports.get = function *(next) {
    if (!validator.isMongoId(this.params.topic_id)) {
        return result(this, {code: 904, msg: 'topic_id错误！'}, 400);
    }
    let topic = yield proxy.Topic.getTopicById(this.params.topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: '获取的话题不存在！'}, 404);
    }
    let user = yield proxy.User.getUserById(topic.userID);
    let info = topic.toObject({getters: true});
    info.expert_info = yield user.toExpert(this.state.userID);
    return result(this, {code: 900, info});
};

//删除话题
exports.delete = function *(next) {
    if (!validator.isMongoId(this.params.topic_id)) {
        return result(this, {code: 904, msg: 'topic_id错误！'}, 400);
    }
    let topic = yield proxy.Topic.getTopicById(this.params.topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: '获取的话题不存在！'}, 404);
    }
    if (topic.userID.toString() != this.state.userID.toString()) {
        return result(this, {code: 910, msg: '无法删除别人的话题！'}, 403);
    }
    topic.delete = true;
    yield topic.save();
    return result(this, {code: 900, topic_id: topic.topic_id});
};

//获取话题评论列表
exports.comments = function *(next) {
    if (!validator.isMongoId(this.params.topic_id)) {
        return result(this, {code: 904, msg: 'topic_id错误！'}, 400);
    }
    let topic = yield proxy.Topic.getTopicById(this.params.topic_id);
    if (!topic) {
        return result(this, {code: 911, msg: '获取的话题不存在！'}, 404);
    }
    let param = {
        topic_id: this.params.topic_id,
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit
    };
    let list = yield proxy.Order.getTopicCommentList(param);
    return result(this, {code: 900, list});
};

