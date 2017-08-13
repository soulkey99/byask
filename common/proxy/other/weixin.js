/**
 * Created by MengLei on 2016-08-24.
 */
"use strict";
const model = require('./../../model');

/**
 * 接收消息，记录数据库
 * @param wxMsg
 */
exports.onMsg = function (wxMsg) {
    let msg = new (model.WXMsg)(wxMsg);
    msg._id = wxMsg.msgId;
    msg.save();
};

