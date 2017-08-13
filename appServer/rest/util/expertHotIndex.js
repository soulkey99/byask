/**
 * Created by MengLei on 2016-07-06.
 */
"use strict";
const co = require('co');
const BagPipe = require('bagpipe');
const eventproxy = require('eventproxy');
let bagPipe = new BagPipe(2);

//定时任务，维护专家的各种指数
module.exports = function () {
    co(proxy.User.getAllExpertIDs()).then(experts=> {
        let ep = new eventproxy();
        ep.after('item', experts.length, ()=> logger.trace('expert index task ok.'));
        ep.fail(err=> logger.error('expert index task error: ' + err.message));
        experts.forEach(item=>bagPipe.push(async, item, ep.done('item')));
    }, err=>logger.error('expert index task error: ' + err.message));
};

function async(userID, callback) {
    co(sync(userID)).then(()=> {
        callback();
    }, err=>callback(err));
}

function *sync(userID) {
    let user = yield proxy.User.getUserById(userID);
    if (!user) {
        return null;
    }
    {//此处计算订单的接单率与响应时间
        let orders = yield proxy.Order.getOrdersByQuery({expert_id: user.userID});
        let total_confirm_time = 0;
        let total_confirm_count = 0;
        let total_reject_count = 0;
        orders.forEach(item=> {
            if ((item.status == 'confirmed' || item.status == 'paid' || item.status == 'toBeFinished' || item.status == 'finished') && item.confirmAt && item.createdAt) {
                total_confirm_count++;
                total_confirm_time += (item.confirmAt - item.createdAt);
            }
            total_reject_count += (item.status == 'rejected' ? 1 : 0);  //拒绝单数
        });
        if (orders.length == 0) {
            user.expertInfo.confirm_rate = 0;
            user.expertInfo.comfirm_time = 0;
        } else {
            user.expertInfo.confirm_rate = (1 - total_confirm_count / orders.length).toFixed(3);
            user.expertInfo.confirm_time = (total_confirm_time / total_confirm_count / 1000 / 60).toFixed(0);
        }
    }
    user.expertInfo.note_confirm_rate = yield proxy.Note.getNoteConfirmRate(userID);
    return yield user.save();
}
