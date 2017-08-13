/**
 * Created by MengLei on 2016-07-14.
 */
"use strict";
const CronJob = require('cron').CronJob;
const co = require('co');
const pingpp = require('../../../config').pingpp;
const proxy = require('../../../common/proxy');

module.exports = {
    addTask: addTask,
    onSuccess: onSuccess,
    doRetrieve: doRetrieve,
    onAppStart: onAppStart
};

//退款成功，设置支付状态
function* onSuccess(ch_id) {
    let pay = yield proxy.Pay.getInfoByChargeID(ch_id);
    if (!pay) { //没有查询到支付记录，不进行下一轮
        return false;
    }
    if (pay.refund_status != 'pending') {  //支付状态不是pending，不继续下一轮
        return false;
    }
    let res = yield doRetrieve(ch_id);
    if (res && res.data.length > 0) {
        let refund = res.data[0];
        if (!refund.succeed) {
            return true;
        }
        pay.refund = refund;
        pay.refund_status = 'success';
        let note = yield proxy.Note.getNoteByID(pay.note_id);
        note.status = 'timeout';
        yield [pay.save(), note.save()];
        proxy.Money.noteRefunded(pay.note_id);
    }
    return false;   //所有操作成功，不进行下一轮
}

function onAppStart() {
    co(proxy.Pay.getPendingRefundIDs()).then(ids=> {
        ids.forEach(id=>addTask(id));
    });
}

//添加一个任务
function addTask(ch_id) {
    new Task(ch_id);
}

//执行获取支付结果的任务
function Task(ch_id) {
    if (!ch_id) {
        return;
    }
    new CronJob(new Date(Date.now() + 15000), cronTick, null, true);
    this.times = 0;
    let self = this;

    function cronTick() {
        if (self.times > 10) {    //超过10次，就不再获取
            return;
        }
        self.times++;
        co(proxy.Pay.getInfoByChargeID(ch_id)).then(pay=> {
            if (!pay) {
                return;
            }
            if (pay.refund_status != 'pending') {
                return;
            }
            if (Date.now() - pay.createdAt > 172800000) {   //超过两天没有支付成功，那么直接设置成超时
                pay.status = 'timeout';
                pay.client_status = 'timeout';
                pay.save();
            }
            pingpp.charges.retrieve(ch_id, (err, charge)=> {
                if (err) {
                    return new CronJob(new Date(Date.now() + 10000), cronTick, null, true);
                }
                if (!charge.paid) {
                    return new CronJob(new Date(Date.now() + 15000), cronTick, null, true);
                }
                co(onSuccess(ch_id)).then(res=> {
                    if (res) {
                        return new CronJob(new Date(Date.now() + 15000), cronTick, null, true);
                    }
                }).catch(err=> new CronJob(new Date(Date.now() + 10000), cronTick, null, true));
            });
        });
    }
}


//thunkify retrieve refund 方法
function doRetrieve(ch_id, callback) {
    return function (callback) {
        pingpp.charges.listRefunds(ch_id, callback);
    }
}