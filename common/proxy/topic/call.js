/**
 * Created by MengLei on 2016-07-05.
 */
"use strict";
const model = require('../../model');

/**
 * 根据call_id获取详细内容
 * @param call_id
 * @returns {*}
 */
exports.getCallById = function *(call_id) {
    return yield model.OrderCall.findById(call_id);
};

/**
 * 根据session获取详情
 * @param session
 * @returns {*}
 */
exports.getCallBySession = function *(session) {
    return yield model.OrderCall.findOne({session: session});
};

/**
 * 根据o_id获取详情
 * @param o_id
 * @returns {*}
 */
exports.getCallByO_id = function *(o_id) {
    return yield model.OrderCall.findOne({o_id: o_id});
};

/**
 * 检查是否有成功进行的呼叫
 * @param o_id
 * @returns {boolean}
 */
exports.checkCall = function *(o_id) {
    let call = yield model.OrderCall.findOne({o_id: o_id, status: 'SUCCESS', duration: {$gt: 180}});
    return !!call;
};

/**
 * 创建一条记录，param = {type: 'order', session: '', o_id: '', caller: '', callee: ''}
 * @param param
 * @returns {*}
 */
exports.create = function *(param) {
    let call = new (model.OrderCall)();
    call.o_id = param.o_id;
    call.session = param.session;
    call.caller = param.caller;
    call.callee = param.callee;
    call.callerType = param.callerType;
    return yield call.save();
};




