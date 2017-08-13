/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";
const model = require('../../model');

/**
 * 根据ID获取配置记录
 * @param config_id
 * @returns {*}
 */
exports.getConfigByID = function *(config_id) {
    return yield model.OnlineConfig.findById(config_id);
};

/**
 * 根据key获取配置记录
 * @param key
 * @returns {*}
 */
exports.getConfigByKey = function *(key) {
    return yield model.OnlineConfig.findOne({key: key});
};

/**
 * 获取配置列表
 * @param platform
 * @returns {Array}
 */
exports.getList = function *(platform) {
    let list = [];
    platform = platform || 'android';
    let configs = yield model.OnlineConfig.find({
        platform: platform.toLowerCase(),
        valid: true
    }).sort({'createdAt': -1});
    configs.forEach(item=>list.push({key: item.key, value: item.value}));
    return list;
};

/**
 * 管理员端获取配置列表
 * @param param = {start: '', page: '', limit: '', platform: ''}
 * @return {Array}
 */
exports.getAdminList = function *(param) {
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
    if (param.valid) {
        query['valid'] = param.valid == 'true';
    }
    if (param.desc) {
        query['desc'] = {$regex: param.desc};
    }
    let configs = yield model.OnlineConfig.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    configs.forEach(item=>list.push(item.toConfig()));
    return list;
};


/**
 * 增加一条配置记录
 * @param param = {key: '', value: '', platform: '', desc: ''}
 * @returns {*}
 */
exports.addConfig = function *(param) {
    let config = new (model.OnlineConfig)();
    config.key = param.key;
    config.value = param.value;
    if (param.platform) {
        config.platform = param.platform.toLowerCase();
    }
    if (param.desc) {
        config.desc = param.desc;
    }
    return yield config.save();
};


