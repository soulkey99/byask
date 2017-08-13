/**
 * Created by MengLei on 2016-06-22.
 */
"use strict";
const model = require('../../model');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * 根据money_id获取记录
 * @param money_id
 * @returns {*}
 */
exports.getMoneyByID = function *(money_id) {
    return yield model.Money.findById(money_id);
};

/**
 * 根据withdraw_id获取提现记录
 * @param withdraw_id
 * @returns {*}
 */
exports.getWithdrawByID = function *(withdraw_id) {
    return yield model.Withdraw.findById(withdraw_id);
};

/**
 * 为用户增加余额，同时记录
 * @param pay_id
 */
exports.addMoney = function*(pay_id) {
    let money1 = new (model.Money)();   //用户支付给专家
    let money2 = new (model.Money)();   //专家收到付款
    let pay = yield model.Pay.findById(pay_id);
    money1.pay_id = pay.pay_id;
    money2.pay_id = pay.pay_id;
    money1.type = pay.type;
    money2.type = pay.type;
    //如果amount大于0，表示别人支付给该用户的，不需要pay_id，如果amount小于0，表示该用户支付给别人的，需要传入pay_id，表示其关联的支付ID
    switch (pay.type) {
        case 'order': {
            money1.userID = pay.userID;
            money2.userID = pay.expert_id;
            money1.amount = (0 - pay.amount);
            money2.amount = pay.amount;
            money1.o_id = pay.o_id;
            money2.o_id = pay.o_id;
            money1.desc = `预约订单${money1.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
            money2.desc = `预约订单${money2.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
        }
            break;
        case 'note': {
            money1.userID = pay.userID;
            money2.userID = pay.expert_id;
            money1.amount = (0 - pay.amount);
            money2.amount = pay.amount;
            money1.note_id = pay.note_id;
            money2.note_id = pay.note_id;
            money1.desc = `小纸条${money1.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
            money2.desc = `小纸条${money2.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
        }
            break;
        case 'listen': {
            let money3 = new (model.Money)();   //小纸条提出者收到付款
            let note = yield model.Note.findById(pay.note_id);
            money3.pay_id = pay.pay_id;
            money3.type = pay.type;
            money1.userID = pay.userID;
            money2.userID = pay.expert_id;
            money3.userID = note.userID;
            money1.amount = (0 - pay.amount);
            money2.amount = pay.amount / 2;
            money3.amount = pay.amount / 2;
            money1.note_id = pay.note_id;
            money2.note_id = pay.note_id;
            money3.note_id = pay.note_id;
            money1.desc = `偷听小纸条${money1.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
            money2.desc = `偷听小纸条${money2.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
            money3.desc = `偷听小纸条${money3.amount > 0 ? '收入' : '支出'}_${genDateStr()}`;
            yield money3.save();
            yield model.User.findByIdAndUpdate(money3.userID, {$inc: {'moneyInfo.money': money3.amount}});
        }
            break;
        default:
            throw(new Error('订单类型不正确！'));
            break;
    }
    yield model.User.findByIdAndUpdate(money2.userID, {$inc: {'moneyInfo.money': money2.amount}});
    yield [money1.save(), money2.save()];
};

/**
 * 用户支付预约订单成功，记录交易信息
 * @param o_id
 * @returns {*}
 */
exports.payOrderSuccess = function *(o_id) {
    let money = new (model.Money)();
    let pay = yield model.Pay.findOne({o_id: o_id, status: 'paid', type: 'order'});
    money.pay_id = pay.pay_id;
    money.type = pay.type;
    money.userID = pay.userID;
    money.amount = (0 - pay.amount);
    money.o_id = pay.o_id;
    money.desc = `预约订单支出_${genDateStr()}`;
    return yield money.save();
};

/**
 * 预约订单结束，资金打入专家账户中，并记录交易信息
 * @param o_id
 * @returns {*}
 */
exports.orderFinished = function*(o_id) {
    let money = new (model.Money)();
    let pay = yield model.Pay.findOne({o_id: o_id, status: 'paid', type: 'order'});
    money.pay_id = pay.pay_id;
    money.type = pay.type;
    money.userID = pay.expert_id;
    money.amount = pay.amount;
    money.o_id = pay.o_id;
    money.desc = `预约订单收入_${genDateStr()}`;
    yield model.User.findByIdAndUpdate(money.userID, {
        $inc: {
            'moneyInfo.total': money.amount,
            'moneyInfo.money': money.amount,
            'moneyInfo.order': money.amount
        }
    });
    return yield money.save();
};

/**
 * 小纸条支付成功，记录交易信息
 * @param note_id
 * @returns {*}
 */
exports.payNoteSuccess = function *(note_id) {
    let money = new (model.Money)();
    let pay = yield model.Pay.findOne({note_id: note_id, status: 'paid', type: 'note'});
    money.pay_id = pay.pay_id;
    money.type = pay.type;
    money.userID = pay.expert_id;
    money.amount = pay.amount;
    money.note_id = pay.note_id;
    money.desc = `小纸条提问支出_${genDateStr()}`;
    return yield money.save();
};

/**
 * 回答小纸条结束，获得收益，记录交易信息
 * @param note_id
 * @returns {*}
 */
exports.noteReplied = function *(note_id) {
    let money = new (model.Money)();
    let pay = yield model.Pay.findOne({note_id: note_id, status: 'paid', type: 'note'});
    money.pay_id = pay.pay_id;
    money.type = pay.type;
    money.userID = pay.expert_id;
    money.amount = pay.amount;
    money.note_id = pay.note_id;
    money.desc = `回答小纸条收入_${genDateStr()}`;
    yield model.User.findByIdAndUpdate(money.userID, {
        $inc: {
            'moneyInfo.total': money.amount,        //累计收入
            'moneyInfo.money': money.amount,        //账户余额
            'moneyInfo.note': money.amount,         //累计纸条收入
            'expertInfo.note_replied': 1            //累计回答纸条数
        }
    });
    return yield money.save();
};

/**
 * 偷听小纸条支付成功，记录交易信息，同时给提问者及回答者增加收益
 * @param note_id
 * @returns {*}
 */
exports.listenNote = function *(note_id) {
    let money1 = new (model.Money)();   //用户支付
    let money2 = new (model.Money)();   //专家收到付款
    let money3 = new (model.Money)();   //提问者收到付款
    let pay = yield model.Pay.findOne({note_id: note_id, type: 'listen', status: 'paid'});
    let note = yield model.Note.findById(note_id);
    money1.pay_id = pay.pay_id;
    money2.pay_id = pay.pay_id;
    money3.pay_id = pay.pay_id;
    money1.type = pay.type;
    money2.type = pay.type;
    money3.type = pay.type;
    money1.userID = pay.userID;
    money2.userID = note.expert_id;
    money3.userID = note.userID;
    money1.amount = (0 - pay.amount);
    money2.amount = pay.amount / 2;
    money3.amount = pay.amount / 2;
    money1.note_id = pay.note_id;
    money2.note_id = pay.note_id;
    money3.note_id = pay.note_id;
    money1.desc = `偷听小纸条支出_${genDateStr()}`;
    money2.desc = `小纸条被偷听收入_${genDateStr()}`;
    money3.desc = `小纸条被偷听收入_${genDateStr()}`;
    //给小纸条的提问者和回答者分别增加余额
    yield [model.User.findByIdAndUpdate(money2.userID, {    //纸条专家
        $inc: {
            'moneyInfo.total': money2.amount,   //累计收入
            'moneyInfo.money': money2.amount,   //余额
            'moneyInfo.note': money2.amount,    //累计纸条收入
            'expertInfo.note_listened': 1       //纸条被偷听数
        }
    }), model.User.findByIdAndUpdate(money3.userID, {   //纸条提问者
        $inc: {
            'moneyInfo.total': money3.amount,   //累计收入
            'moneyInfo.money': money3.amount,   //余额
            'moneyInfo.note': money3.amount     //累计纸条收入
        }
    })];
    return yield [money1.save(), money2.save(), money3.save()];
};

/**
 * 小纸条超时退款
 * @param note_id
 * @returns {*}
 */
exports.noteRefunded = function *(note_id) {
    let money = new (model.Money)();
    let pay = yield model.Pay.findOne({note_id: note_id, status: 'paid', type: 'note'});
    money.pay_id = pay.pay_id;
    money.type = pay.type;
    money.userID = pay.expert_id;
    money.amount = pay.amount;
    money.note_id = pay.note_id;
    money.desc = `小纸条超时，款项退回原支付渠道_${genDateStr()}`;
    return yield money.save();
};

/**
 * 记录提现
 * @param param = {userID: '', amount: ''}
 * @returns {*}
 */
exports.withdraw = function *(param) {
    let money = new (model.Money)();
    let withdraw = new (model.Withdraw)();
    let user = yield model.User.findById(param.userID);
    money._id = ObjectId();
    money.userID = param.userID;
    money.desc = `${user.expert_status == 'verified' ? '专家' : '用户'}提现_${genDateStr()}`;
    money.type = 'withdraw';
    money.amount = param.amount;

    withdraw.userID = money.userID;
    withdraw.amount = money.amount;
    withdraw.money = money.amount * (user.expert_status == 'verified' ? 0.9 : 1);    //暂定提现专家抽成10%，用户不抽成
    withdraw.money_id = money._id;

    return yield [
        money.save(),   //保存账单记录
        withdraw.save(),    //保存提现记录
        model.User.findByIdAndUpdate(money.userID,
            {    //改变用户信息中的记录
                $inc: {
                    'moneyInfo.money': 0 - money.amount,
                    'moneyInfo.withdrawing': money.amount
                }
            })
    ];
};

/**
 * 管理员端获取用户资金变动记录
 * @param param = {userID: '', start: '', page: '', limit: '', status: ''}
 * @returns {Array}
 */
exports.getAdminList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.startAt && param.endAt) {
        query['createdAt'] = {$gte: new Date(param.startAt), $lte: new Date(param.endAt)};
    } else if (param.startAt) {
        query['createdAt'] = {$gte: new Date(param.startAt)};
    } else if (param.endAt) {
        query['createdAt'] = {$lte: new Date(param.endAt)};
    }
    if (param.userID) {
        query['userID'] = param.userID;
    }
    if (param.type) {
        query['type'] = param.type;
    }
    let list = [];
    let res = yield model.Money.find(query).sort({createdAt: -1}).skip(start).limit(count);
    for (let i = 0; i < res.length; i++) {
        let item = res[i].toItem();
        list.push(item);
    }
    return list;
};

/**
 * 管理员获取提现记录
 * @param param = {userID: '', status: '', start: '', limit: ''}
 */
exports.getWithdrawList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.userID) {
        query['userID'] = param.userID;
    }
    if (param.status) {
        query['status'] = param.status;
    }
    if (param.startAt && param.endAt) {
        query['createdAt'] = {$gte: new Date(param.startAt), $lte: new Date(param.endAt)};
    } else if (param.startAt) {
        query['createdAt'] = {$gte: new Date(param.startAt)};
    } else if (param.endAt) {
        query['createdAt'] = {$lte: new Date(param.endAt)};
    }
    let list = [];
    let res = yield model.Withdraw.find(query).sort({createdAt: -1}).skip(start).limit(count);
    for (let i = 0; i < res.length; i++) {
        let item = res[i].toItem();
        let user = yield model.User.findById(item.userID);
        if (user && user.expertInfo.status == 'verified') {
            item.expert_status = 'verified';
            item.expert_info = yield user.toExpert();
        } else if (user) {
            item.expert_status = user.expertInfo.status;
            item.user_info = user.toUser();
        }
        list.push(item);
    }
    return list;
};

/**
 * 获取指定用户本月提现记录次数
 * @param userID
 * @returns {*}
 */
exports.checkWithdraw = function *(userID) {
    let t1 = new Date();
    let t2 = new Date();
    t1.setDate(1);
    t1.setHours(0, 0, 0, 0);
    t2.setMonth(t1.getMonth() + 1, 1);
    t2.setHours(0, 0, 0, 0);
    return yield model.Withdraw.count({userID: userID, createdAt: {$gte: t1, $lt: t2}});
};

/**
 * 生成日期字符串，2016-05-13
 * @param t
 * @returns {string}
 */
function genDateStr(t) {
    if (!t) {
        t = Date.now();
    }
    //生成八位日期字符串
    let curDate = new Date(t);
    let month = (curDate.getMonth() + 1).toString();
    let date = curDate.getDate().toString();
    return `${curDate.getFullYear().toString()}-${month.length < 2 ? '0' + month : month}-${date.length < 2 ? '0' + date : date}`;
}

