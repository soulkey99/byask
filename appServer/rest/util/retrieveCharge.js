/**
 * Created by MengLei on 2016-06-23.
 */
"use strict";
const CronJob = require('cron').CronJob;
const co = require('co');
const pingpp = require('../../../config').pingpp;

module.exports = {
    addTask: addTask,
    onSuccess: onSuccess,
    doRetrieve: doRetrieve,
    onAppStart: onAppStart
};
const proxy = require('../../../common/proxy');
//支付成功，设置支付状态
function* onSuccess(ch_id) {
    let pay = yield proxy.Pay.getInfoByChargeID(ch_id);
    if (!pay) { //没有查询到支付记录，不进行下一轮
        return false;
    }
    if (pay.status != 'pending') {  //支付状态不是pending，不继续下一轮
        return false;
    }
    let charge = yield doRetrieve(ch_id);
    if (!charge.paid) { //没有支付成功，继续进行下一轮查询
        return true;
    }
    pay = yield proxy.Pay.paySuccess(pay.pay_id);
    if (!pay) { //设置支付成功失败，说明已经设置过了，不进行下一轮
        return false;
    }
    if (pay.status != 'paid') { //设置成功失败，进行下一轮
        return true;
    }
    // proxy.Money.addMoney({  //所有操作成功，执行增加余额
    //     userID: pay.userID,
    //     pay_id: pay.pay_id,
    //     o_id: pay.o_id,
    //     note_id: pay.note_id,
    //     type: pay.type,
    //     amount: pay.amount
    // });

    //状态改变的通知
    if (pay.type == 'order') {
        mqttSend(pay.expert_id, 'order', {status: 'paid', o_id: pay.o_id.toString()});
    } else if (pay.type == 'note') {
        mqttSend(pay.expert_id, 'note', {status: 'paid', note_id: pay.note_id.toString()});
    }

    return false;   //所有操作成功，不进行下一轮
}

function onAppStart() {
    co(proxy.Pay.getPendingChIDs()).then(ids=> {
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
            if (pay.status != 'pending') {
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

//thunkify ping++ retrieve
function doRetrieve(ch_id, callback) {
    return function (callback) {
        pingpp.charges.retrieve(ch_id, callback);
    }
}

//每日定时任务，获取pending订单检查支付状态