/**
 * Created by MengLei on 2016-07-13.
 */
"use strict";
const co = require('co');
const pingpp = require('../../../config').pingpp;

//维护小纸条超时状态，每小时运行一次，如果小纸条超时，那么直接退款给用户的原支付渠道，暂定小纸条超时时间为48小时
module.exports = function () {
    logger.trace('note hourly task start.');
    co(exec()).then(()=> logger.trace(`note hourly task ok.`), err=>console.log(`note hourly task error: ${err.message}`));
};

function * exec() {
    let t = new Date();
    t.setDate(t.getDate() - 2); //获取两天前的时间
    let notes = yield proxy.Note.getNotesByQuery({status: 'paid', createdAt: {$lte: t}});
    //这里将超时两天的小纸条退款
    for (let i = 0; i < notes.length; i++) {
        let pay = yield proxy.Pay.getPayByNoteID(notes[i].note_id);
        if (pay) {
            try {
                pay.refund = yield doRefund(pay.charge.id);
            } catch (ex) {
                logger.error('note refund error: ' + ex.message);
            }
            pay.refund_status = 'pending';
            yield pay.save();
        }
    }
}

//thunkify refund 方法
function doRefund(p, callback) {
    return function (callback) {
        pingpp.charges.createRefund(p, {description: '小纸条超时退款'}, callback);
    }
}
