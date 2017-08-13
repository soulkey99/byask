/**
 * Created by MengLei on 2016-08-04.
 */
"use strict";
const model = require('./../../model');

/**
 * 根据share_id获取记录内容
 * @param id
 * @returns {*}
 */
exports.getShareById = function *(id) {
    return yield model.Share.findById(id);
};

/**
 * 创建一条分享记录
 * @param param = {userID: '', action: '', param: {}}
 * @returns {*}
 */
exports.create = function *(param) {
    let share = new (model.Share)();
    share.userID = param.userID;
    share.type = param.type;
    share.target = param.target;
    share.param = param.param;
    return yield share.save();
};

