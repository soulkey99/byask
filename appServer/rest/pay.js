/**
 * Created by MengLei on 2016-06-23.
 */
"use strict";
//根据pay_id获取charge
exports.get = function *(next) {
    let pay_id = this.params.pay_id;
    if (!validator.isMongoId(pay_id)) {
        return result(this, {code: 904, msg: 'pay_id格式不正确！'}, 400);
    }
    let pay = yield proxy.Pay.getPayById(pay_id);
    if (!pay) {
        return result(this, {code: 911, msg: '支付记录不存在！'}, 404);
    }
    if (this.state.userID != pay.userID.toString()) {
        return result(this, {code: 910, msg: '无法获取其他用户的订单内容！'}, 403);
    }
    let info = pay.toObject({getters: true});
    return result(this, {code: 900, info});
};

//获取支付状态
exports.getStatus = function*(next) {
    let pay_id = this.params.pay_id;
    if (!validator.isMongoId(pay_id)) {
        return result(this, {code: 904, msg: 'pay_id格式不正确！'}, 400);
    }
    let pay = yield proxy.Pay.getPayById(pay_id);
    if (!pay) {
        return result(this, {code: 911, msg: '支付记录不存在！'}, 404);
    }
    if (this.state.userID != pay.userID.toString()) {
        return result(this, {code: 910, msg: '无法获取他用户的订单状态！'}, 403);
    }
    return result(this, {code: 900, status: pay.status, client_status: pay.client_status});
};

//设置客户端支付状态
exports.setStatus = function*(next) {
    let pay_id = this.params.pay_id;
    if (!validator.isMongoId(pay_id)) {
        return result(this, {code: 904, msg: 'pay_id格式不正确！'}, 400);
    }
    let pay = yield proxy.Pay.getPayById(pay_id);
    if (!pay) {
        return result(this, {code: 911, msg: '支付记录不存在！'}, 404);
    }
    if (this.state.userID != pay.userID.toString()) {
        return result(this, {code: 910, msg: '无法设置他用户的订单状态！'}, 403);
    }
    pay.client_status = this.request.body.status || 'success';
    if (pay.client_status == 'cancel') {
        pay.status = 'cancel';
    } else if (pay.client_status == 'invalid') {
        pay.status = 'fail';
    }
    if (['success', 'fail', 'cancel', 'invalid'].indexOf(pay.client_status) < 0) {
        return result(this, {code: 904, msg: '支付状态参数不正确！'}, 400);
    }
    //如果客户端支付成功之后，服务器应该主动获取一次支付状态，然后执行相应的操作
    if (pay.client_status == 'success') {
        require('./util/retrieveCharge').addTask(pay.charge.id);
        if (pay.type == 'listen') { //对于偷听类的支付操作，为了用户体验，取即时状态
            yield proxy.Note.payListenSuccess({userID: pay.userID, note_id: pay.note_id});
        }
    }
    yield pay.save();
    return result(this, {code: 900});
};

//设置支付密码
exports.setPayPasswd = function *(next) {
    if (!this.request.body.passwd) {
        return result(this, {code: 904, msg: '请输入支付密码！'});
    }
    let withdraw = yield proxy.User.getUserWithdraw(this.state.userID);
    withdraw.passwd = this.request.body.passwd;
    yield withdraw.save();
    return result(this, {code: 900});
};

//设置密保问题
exports.setSecureQuestion = function *(next) {
    let body = this.request.body;
    if (!body.answer1 && !body.answer2 || !body.answer3) {
        return result(this, {code: 904, msg: '密保问题答案填写不全！'});
    }
    let withdraw = yield proxy.User.getUserWithdraw(this.state.userID);
    withdraw.answer1 = body.answer1;
    withdraw.answer2 = body.answer2;
    withdraw.answer3 = body.answer3;
    yield withdraw.save();
    return result(this, {code: 900});
};

//检查是否设置过支付密码或者密保问题或者支付账户信息
exports.checkSecure = function*(next) {
    let withdraw = yield proxy.User.getUserWithdraw(this.state.userID);
    return result(this, {
        code: 900,
        passwd: !!withdraw.passwd,
        questions: (!!withdraw.answer1 && !!withdraw.answer2 && !!withdraw.answer3),
        withdraw: !!withdraw.withdraw.id
    });
};

//设置提现账户
exports.setWithdrawInfo = function *(next) {
    let withdraw = yield proxy.User.getUserWithdraw(this.state.userID);
    let body = this.request.body;
    if (body.type) {
        withdraw.withdraw.type = body.type;
    }
    withdraw.withdraw.id = body.id;
    withdraw.withdraw.name = body.name;
    yield withdraw.save();
    return result(this, {code: 900});
};

//获取提现账户
exports.getWithdrawInfo = function *(next) {
    let withdraw = yield proxy.User.getUserWithdraw(this.state.userID);
    let info = {type: '', id: '', name: ''};
    if (withdraw.withdraw.id) {
        info = withdraw.withdraw.toObject();
    }
    return result(this, {code: 900, info});
};

//提现
exports.withdraw = function *(next) {
    let param = {
        userID: this.state.userID,
        amount: Number.parseInt(this.request.body.amount)
    };
    let count = yield proxy.Money.checkWithdraw(param.userID);
    if (count > 100) {
        return result(this, {code: 910, msg: '超出当月可提现次数限制！'});
    }
    yield proxy.Money.withdraw(param);
    return result(this, {code: 900});
};

//ping++ webhook
exports.webhook = function*(next) {
    if (!this.request.body.type) {
        return resp(this, "Event 对象中缺少 type 字段！", 400);
    }
    //校验签名
    // logger.trace(`webhook header: ${this.header['x-pingplusplus-signature']}`);
    // let raw_data = JSON.stringify(this.request.body);
    // let signature = this.header['x-pingplusplus-signature'];
    // if (!verify()) {
    //     logger.error(`签名校验失败：${signature}, ${raw_data}`);
    //     return resp(this, "签名校验失败！", 400);
    // }
    yield proxy.Pay.createWebhook(this.request.body);
    switch (this.request.body.type) {
        case "charge.succeeded":
            // 支付对象，支付成功时触发
            yield require('./util/retrieveCharge').onSuccess(this.request.body.data.object.id);
            resp(this, "OK");
            break;
        case "refund.succeeded":
            // 退款对象，退款成功时触发
            yield require('./util/retrieveRefund').onSuccess(this.request.body.data.object.charge);
            resp(this, "OK");
            break;
        case "summary.daily.available":
            // 上一天 0 点到 23 点 59 分 59 秒的交易金额和交易量统计，在每日 02:00 点左右触发
            resp(this, "OK");
            break;
        case "summary.weekly.available":
            // 上周一 0 点至上周日 23 点 59 分 59 秒的交易金额和交易量统计，在每周一 02:00 点左右触发
            resp(this, "OK");
            break;
        case "summary.monthly.available":
            // 上月一日 0 点至上月末 23 点 59 分 59 秒的交易金额和交易量统计，在每月一日 02:00 点左右触发
            resp(this, "OK");
            break;
        case "transfer.succeeded":
            // 企业支付对象，支付成功时触发
            resp(this, "OK");
            break;
        case "red_envelope.sent":
            // 红包对象，红包发送成功时触发
            resp(this, "OK");
            break;
        case "red_envelope.received":
            // 红包对象，红包接收成功时触发
            resp(this, "OK");
            break;
        default:
            resp(this, "未知 Event 类型", 400);
            break;
    }

    //返回结果的方法
    function resp(ctx, msg, code) {
        ctx.status = code || 200;
        ctx.set('Content-Type', 'text/plain; charset=utf-8');
        ctx.body = msg;
    }

    //校验签名的方法
    function verify() {
        let pub_key = require('./../../config').pingpp_pub_key;
        let verifier = require('crypto').createVerify('RSA-SHA256').update(raw_data, 'utf8');
        return verifier.verify(pub_key, signature, 'base64');
    }
};



