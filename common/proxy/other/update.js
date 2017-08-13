/**
 * Created by MengLei on 2016-07-28.
 */
"use strict";
const model = require('../../model');

/**
 * 根据ID获取更新记录
 * @param id
 * @returns {*}
 */
exports.getUpdateById = function *(id) {
    return yield model.Update.findById(id);
};

/**
 * 检测更新，获取最新一条记录
 * @param param = {platform: 'ios/android'}
 */
exports.check = function*(param) {
    let res = yield model.Update.findOne({platform: param.platform, valid: true}).sort({code: -1});
    return res.toInfo();
};

/**
 * 获取更新列表
 * @param param = {platform: '', start: '', limit: ''}
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
    let query = {};
    if (param.platform) {
        query['platform'] = param.platform;
    }
    let res = yield model.Update.find().sort({code: -1}).skip(start).limit(count);
    let list = [];
    res.forEach(i=>list.push(i.toObject({getters: true})));
    return list;
};

/**
 * 添加一条更新记录
 * @param param = {platform: '', version: '', code: '', url: '', desc: '', time: '', valid: ''}
 */
exports.add = function *(param) {
    let update = new (model.Update)();
    if (param.platform) {
        update.platform = param.platform;
    }
    update.code = param.code;
    update.version = param.version;
    update.url = param.url;
    update.desc = param.desc;
    update.valid = param.valid == 'true';
    update.time = param.time;
    return yield update.save();
};

