/**
 * Created by MengLei on 2016-08-04.
 */
"use strict";
const model = require('./../../model');

/**
 * 根据config_id获取配置记录
 * @param id
 * @returns {*}
 */
exports.getSysConfigByID = function *(id) {
    return yield model.SysConfig.findById(id);
};

/**
 * 根据配置类型获取最新的可用配置信息
 * @param type
 * @returns {*}
 */
exports.getConfigByType = function *(type) {
    return yield model.SysConfig.findOne({valid: true, type}).sort({createdAt: -1});
};

/**
 * 创建一条新的配置记录
 * @param param = {type: '', valid: '', param: {}}
 * @returns {*}
 */
exports.create = function *(param) {
    let config = new (model.SysConfig)();
    config.type = param.type;
    if (param.valid) {
        config.valid = param.valid == 'true';
    }
    config.param = param.param;
    return yield config.save();
};

