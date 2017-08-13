/**
 * Created by MengLei on 2016-06-22.
 */
"use strict";
const model = require('../../model');

/**
 * 获取一条支付记录
 * @param pay_id
 * @returns {Query}
 */
exports.getPayById = function *(pay_id) {
    return yield model.Pay.findById(pay_id);
};

/**
 * 通过note_id获取最新一条已支付的pay记录
 * @param note_id
 * @returns {*}
 */
exports.getPayByNoteID = function*(note_id) {
    return yield model.Pay.findOne({note_id: note_id, status: 'paid', type: 'note'}).sort({createdAt: -1});
};

/**
 * 通过query获取已支付的pay记录列表
 * @param query
 * @returns {*}
 */
exports.getPayByQuery = function *(query) {
    return yield model.Pay.find(query);
};

/**
 * 创建支付订单param = {pay_id: '', userID: '', o_id: '', note_id: '', type: '', channel: '', amount: '', rebate: '', money: '', currency: '', subject: '', desc: '', charge: Object}
 * @param param
 */
exports.createPay = function *(param) {
    let pay = new (model.Pay)({
        userID: param.userID,
        type: param.type,
        amount: param.amount,
        money: param.money,
        channel: param.channel,
        currency: param.currency,
        subject: param.subject,
        desc: param.desc,
        charge: param.charge
    });
    switch (pay.type) {
        case 'order': {
            pay.expert_id = param.expert_id;
            pay.o_id = param.o_id;
        }
            break;
        case 'note':
            pay.expert_id = param.expert_id;
            pay.note_id = param.note_id;
            break;
        case 'listen':
            pay.note_id = param.note_id;
            break;
        case 'withdraw':
            break;
    }
    return yield pay.save();
};

/**
 * 获取支付状态为pending的支付订单的ch_id
 * @returns {Array}
 */
exports.getPendingChIDs = function *() {
    let query = {status: 'pending', createdAt: {$gte: (new Date(Date.now() - 86400000 * 2))}};
    let pending = yield model.Pay.find(query);
    let ids = [];
    pending.forEach(item=>ids.push(item.charge.id));
    return ids;
};

/**
 * 获取pending状态下的退款id列表
 * @return {Array}
 */
exports.getPendingRefundIDs = function *() {
    let query = {refund_status: 'pending', createdAt: {$gte: (new Date(Date.now() - 86400000 * 2))}};
    let pending = yield model.Pay.find(query);
    let ids = [];
    pending.forEach(item=>ids.push(item.charge.id));
    return ids;
};

/**
 * 通过ping++ ch_id获取支付信息
 * @param ch_id
 * @returns {*|Query}
 */
exports.getInfoByChargeID = function *(ch_id) {
    return model.Pay.findOne({'charge.id': ch_id});
};

/**
 * 确认支付成功之后，改写数据库中结果
 * @param pay_id
 * @returns {*|Query}
 */
exports.paySuccess = function *(pay_id) {
    let pay = yield model.Pay.findOneAndUpdate({_id: pay_id, status: 'pending'},
        {$set: {status: 'paid', client_status: 'success'}},
        {new: true}
    );
    if (pay && pay.status == 'paid') {
        switch (pay.type) {
            case 'order':   //订单支付成功
                yield [
                    model.Order.findByIdAndUpdate(pay.o_id, {$set: {status: 'paid'}}),
                    require('./money').payOrderSuccess(pay.o_id)
                ];
                break;
            case 'note':    //小纸条支付成功
                yield [
                    model.Note.findByIdAndUpdate(pay.note_id, {$set: {status: 'paid'}}),
                    require('./money').payNoteSuccess(pay.note_id)
                ];
                break;
            case 'listen':  //偷听支付成功，将用户ID加入偷听列表以及将note_id加入用户的偷听历史，同时更新账户余额
                yield [
                    require('./../topic/note').payListenSuccess({userID: pay.userID, note_id: pay.note_id}),
                    require('./money').listenNote(pay.note_id)
                ];
                break;
            case 'withdraw':
                break;
            default:
                break;
        }
    }
    return pay;
};

exports.createWebhook = function *(info) {
    let webhook = new (model.Webhook)(info);
    return yield webhook.save();
};

