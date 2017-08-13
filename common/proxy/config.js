/**
 * Created by MengLei on 2016-06-16.
 */
"use strict";
const model = require('../model');

/**
 * 根据userID返回用户信息
 * Callback;
 * - err, 数据库异常
 * - doc, 返回结果
 * @param {String} conf_id  配置信息的ID
 */
exports.getConfig = function (conf_id) {
    return model.Config.findById(conf_id);
};
