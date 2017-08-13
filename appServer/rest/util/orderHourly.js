/**
 * Created by MengLei on 2016-07-14.
 */
"use strict";
const co = require('co');

//维护订单超时状态，每小时运行一次，如果专家确认完成订单但是用户没有确认，那么48小时之后，自动完成，将钱打入专家余额，同时给订单好评，状态改为finished
module.exports = function () {
    co(exec()).then(()=> logger.trace('order hourly task ok.'), err=>logger.error('order hourly task error: ' + err.message));
};

function * exec() {
    let t = new Date();
    t.setDate(t.getDate() - 2); //获取两天前的时间
    let orders = yield proxy.Order.getOrdersByQuery({status: 'toBeFinished', finishAt: {$lte: t}});
    for (let i = 0; i < orders.length; i++) {
        yield proxy.Order.onFinish({o_id: orders[i].o_id, auto: true});
    }
}

