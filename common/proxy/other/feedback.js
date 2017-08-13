/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";
const model = require('./../../model');

/**
 * 根据ID获取记录
 * @param id
 * @returns {*}
 */
exports.getFeedbackByID = function *(id) {
    return yield model.Feedback.findById(id);
};

/**
 * 获取指定用户的返回列表
 * @param param = {userID: '', start: '', limit: '', flag: ''}
 * @returns {Array}
 */
exports.getUserFeedback = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {userID: param.userID};
    let feedbacks = yield model.Feedback.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    feedbacks.forEach(item=>list.push(item.toFeedback()));
    return list;
};

/**
 * 创建一条反馈记录
 * @param param = {userID: '', content: ''}
 * @returns {*}
 */
exports.createFeedback = function *(param) {
    let feedback = new (model.Feedback)();
    if (param.userID) {
        feedback.userID = param.userID;
    }
    if (param.direction) {
        feedback.direction = param.direction;
    }
    feedback.content = param.content;
    return yield feedback.save();
};

/**
 * 获取指定用户的意见反馈列表
 * @param param = {userID: '', start: '', page: '', limit: ''}
 * @returns {Array}
 */
exports.getList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let feedbacks = yield model.Feedback.find({userID: param.userID}).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    feedbacks.forEach(item=>list.push(item.toFeedback()));
    yield model.Feedback.update({userID: param.userID}, {$set: {read: true}}, {multi: true});
    return list;
};

/**
 * 管理员端获取用户反馈主列表
 * @param param = {start: '', page: '', limit: ''}
 * @returns {Array}
 */
exports.getAdminList = function *(param) {
    if (!param) {
        param = {};
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {direction: 'u2a'};
    let feedbacks = yield aggregate([{$match: query}, {$sort: {createdAt: -1}}, {
        $group: {
            _id: '$userID',
            createdAt: {$first: '$createdAt'}
        }
    }, {$sort: {createdAt: -1}}, {$skip: start}, {$limit: count}]);
    let list = [];
    for (let i = 0; i < feedbacks.length; i++) {
        let res = yield [model.Feedback.findOne({
            userID: feedbacks[i]._id,
            direction: 'u2a'
        }, {}, {sort: '-time'}), model.User.findById(feedbacks[i]._id)];
        let item = res[0].toFeedback();
        item.user = res[1].toUser();
        list.push(item);
    }
    return list;
};

//由于aggregate方法本身不支持yield，所以这里先thunkify一下
function aggregate(query, callback) {
    return function (callback) {
        model.Feedback.aggregate(query, callback);
    }
}

