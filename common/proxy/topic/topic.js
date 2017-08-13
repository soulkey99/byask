/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const model = require('../../model');

/**
 * 查询banner列表
 * - list, 返回结果
 */
exports.getTopicById = function*(id) {
    return yield model.Topic.findById(id);
};

/**
 * 根据userID获取topics
 * @param userID
 * @returns {*}
 */
exports.getUserTopics = function*(userID) {
    return yield model.Topic.find({userID: userID});
};

/**
 * 获取指定用户的一个topic
 * @param u_id 指定用户ID
 * @param userID 执行动作的用户ID
 * @return {*}
 */
exports.getUserOneTopic = function*(u_id, userID) {
    let res = yield [
        model.User.findById(u_id),
        model.Topic.findOne({userID: u_id, status: 'verified', delete: false})
    ];
    let item = {type: 'user', topic_info: {}, expert_info: {}};
    if (res[1]) {
        item.topic_info = yield res[1].toTopic();
    } else {
        return null;
    }
    if (res[0]) {
        item.expert_info = yield res[0].toExpert(userID);
    }
    return item;
};

/**
 * 根据专家ID获取topics
 * @param expert_id
 * @returns {*}
 */
exports.getExpertTopics = function*(expert_id) {
    return yield model.Topic.find({expert_id: expert_id});
};

exports.getTopicsByQuery = function *(query, opt) {
    return yield model.Topic.find(query, {}, opt);
};

/**
 * 新增、编辑话题
 * @param info
 * @returns {*}
 */
exports.editTopic = function *(info) {
    let topic = null;
    if (info.topic_id) {
        topic = yield model.Topic.findById(info.topic_id);
    }
    if (!topic) {
        topic = new (model.Topic)();
    }
    topic.userID = info.userID;
    topic.category = info.category;
    topic.subCategory = info.subCategory;
    topic.type = info.type || 'phone';
    topic.title = info.title;
    topic.summary = info.summary;
    topic.description = info.description;
    topic.price = info.price;
    topic.duration = info.duration;
    topic.tags = info.tags;
    if (info.status) {
        topic.status = info.status;
    }
    return yield topic.save();
};

//获取指定用户的话题列表
exports.getUserTopicList = function *(param) {
    let query = {};
    if (param.expert_id) {
        query['userID'] = param.expert_id;
    }
    if (param.status) {
        query['status'] = param.status;
    }
    if (param.delete != undefined) {
        query['delete'] = false;
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let topics = yield model.Topic.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < topics.length; i++) {
        let item = yield topics[i].toTopic();
        item.description = topics[i].description;
        item.summary = topics[i].summary;
        list.push(item);
    }
    return list;
};

//获取话题列表
exports.getList = function *(param) {
    let query = {delete: false, status: 'verified'};    //只能获取已审核通过并且未删除的那些
    if (param.category) {
        query['category'] = param.category;
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let topics = yield model.Topic.find(query).sort({updatedAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < topics.length; i++) {
        let item = {
            topic_info: yield topics[i].toTopic()
        };
        let user = yield model.User.findById(topics[i].userID);
        item.expert_info = yield user.toExpert(param.userID);
        list.push(item);
    }
    return list;
};

/**
 * 用户获取发现专区内的话题列表
 * @param param = {start: '', page: '', limit: '', userID: ''}
 * @returns {*}
 */
exports.getDiscover = function *(param) {
    let query = {status: 'verified', delete: false};
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let topics = yield model.Topic.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < topics.length; i++) {
        let item = {
            topic_info: yield topics[i].toTopic()
        };
        let user = yield model.User.findById(topics[i].userID);
        item.expert_info = yield user.toExpert(param.userID);
        list.push(item);
    }
    return list;
};

/**
 * 搜索话题，从话题title和description搜索关键字
 * @param param = {userID: '', start: '', page: '', limit: '', key: '关键字'}
 * @returns {Array}
 */
exports.search = function *(param) {
    let query = {
        $or: [
            {title: {$regex: param.key}},
            {summary: {$regex: param.key}}
        ],
        status: 'verified',
        delete: false
    };
    yield require('../other/hotWord').onSearch(param.key);
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let topics = yield model.Topic.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < topics.length; i++) {
        let item = {
            topic_info: yield topics[i].toTopic()
        };
        let user = yield model.User.findById(topics[i].userID);
        item.expert_info = yield user.toExpert(param.userID);
        list.push(item);
    }
    return list;
};
