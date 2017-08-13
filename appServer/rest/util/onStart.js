/**
 * Created by MengLei on 2016-06-24.
 */
"use strict";
const CronJob = require('cron').CronJob;

//维护支付状态，每日凌晨3点30分执行
new CronJob('00 30 03 * * *', require('./retrieveCharge').onAppStart, null, true);

//维护小纸条的超时状态，每小时执行一次
new CronJob('00 10 * * * *', require('./noteHourly'), null, true);

//维护订单的超时状态，每小时执行一次
new CronJob('00 15 * * * *', require('./orderHourly'), null, true);

//维护用户的一些统计信息
new CronJob('00 20 * * * *', require('./expertHotIndex'), null, true);

//小红点维护数据，对于已完结的订单，将未读消息置成已读
