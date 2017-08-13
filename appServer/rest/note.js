/**
 * Created by MengLei on 2016-06-27.
 */
"use strict";
const dateUtil = require('../../utils/date');
const ip = require('ip');
const ObjectID = require('mongoose').Types.ObjectId;
const pingpp_app_id = require('../../config').pingxx_config.app_id;
const pingpp = require('../../config').pingpp;

//创建小纸条
exports.create = function *(next) {
    let expert_id = this.params.userID;
    let expert = yield proxy.User.getUserById(expert_id);
    if (!expert) {
        return result(this, {code: 902, msg: '达人不存在！'}, 400);
    }
    if (expert.expertInfo.status != 'verified') {
        return result(this, {code: 910, msg: '提问失败，该用户不是达人身份！'}, 400);
    }
    let param = {
        userID: this.state.userID,
        expert_id: expert_id,
        price: expert.expertInfo.note_price,
        anonymous: this.request.body.anonymous == 'true',
        content: this.request.body.content
    };
    let note = yield proxy.Note.createNote(param);
    return result(this, {code: 900, note_id: note.note_id});
};

//获取小纸条详情
exports.get = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    let info = note.toObject({getters: true});
    info.ups = note.ups.length;
    info.listen = note.list.length;
    if (this.state.userID == info.userID.toString() || this.state.userID == info.expert_id.toString()) {
        info.needPay = false;
    } else {
        info.reply = '';
        info.needPay = true;
        for (let i = 0; i < note.list.length; i++) {
            if (note.list[i].toString() == this.state.userID) {
                info.reply = note.reply;
                info.needPay = false;
            }
        }
    }
    let ids = [];   //逆序取后五个偷听者的ID
    for (let i = 0; i < (info.listen >= 6 ? 6 : info.listen); i++) {
        ids.push(note.list[info.listen - i - 1]);
    }
    info.listeners = yield proxy.User.getUserInfos(ids);
    let res = yield [proxy.User.getUserById(info.userID), proxy.User.getUserById(info.expert_id)];
    if (!info.anonymous || this.state.userID == info.userID) {
        info.user_info = res[0].toUser();
    }
    if (info.status == 'paid') {  //仅待回答状态订单有，超时时间
        info.time_left = Date.now() - note.createdAt;
    }
    info.expert_info = yield res[1].toExpert(this.state.userID);
    return result(this, {code: 900, info});
};

//取消小纸条订单
exports.cancel = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    if (note.userID.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法取消不是自己的小纸条！'}, 400);
    }
    if (note.status != 'pending') {
        return result(this, {code: 910, msg: '小纸条状态不合法，无法取消！'});
    }
    note.status = 'canceled';

    //状态改变的通知
    // mqttSend(note.expert_id, 'note', {note_id: note.note_id, status: note.status});

    yield note.save();
    return result(this, {code: 900});
};

//支付小纸条
exports.pay = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    if (note.userID.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '无法支付不是自己的小纸条！'}, 400);
    }
    if (note.status != 'pending') {
        return result(this, {code: 910, msg: '小纸条状态不合法，无法支付！'});
    }
    let pay_id = new ObjectID;
    let param = {
        pay_id: pay_id,
        userID: this.state.userID,
        expert_id: note.expert_id,
        note_id: note.note_id,
        type: 'note',
        channel: this.request.body.channel || 'alipay',
        amount: note.price,
        money: note.price,
        currency: this.request.body.currency || 'cny',
        subject: this.request.body.subject || `支付小纸条_${dateUtil.genDateStr()}`,
        desc: this.request.body.desc || ''
    };
    let extra = {};
    if (param.channel == 'wx_pub') {
        let sso = yield proxy.User.getSSO({userID: this.state.userID, type: 'weixin'});
        extra.open_id = sso.openid;
    }
    param.charge = yield doCharge({
        order_no: note.note_id,
        app: {id: pingpp_app_id},
        channel: param.channel,
        amount: param.money,
        client_ip: ip.isV4Format(this.ip) ? this.ip : '127.0.0.1',
        currency: param.currency,
        subject: param.subject,
        body: `支付小纸条_${dateUtil.genDateStr()}_${note.note_id}`,
        description: param.desc,
        extra: extra
    });
    let pay = yield proxy.Pay.createPay(param);
    return result(this, {code: 900, pay_id: pay.pay_id, charge: param.charge});
    //thunkify charge 方法
    function doCharge(p, callback) {
        return function (callback) {
            pingpp.charges.create(p, callback);
        }
    }
};

//用户获取自己发出的小纸条列表
exports.getList = function *(next) {
    let param = {userID: this.state.userID};
    let body = this.request.query;
    if (body.status) {
        param['status'] = body.status.split(',');
    }
    if (body.start) {
        param['start'] = body.start;
    }
    if (body.page) {
        param['page'] = body.page;
    }
    if (body.limit) {
        param['limit'] = body.limit;
    }
    yield proxy.MqttMsg.markPoint({userID: param.userID, type: 'note', status: param.status});
    let list = yield proxy.Note.getUserNoteList(param);
    return result(this, {code: 900, list});
};

//用户获取自己偷听过的小纸条列表
exports.getListenList = function *(next) {
    let param = {userID: this.state.userID};
    let body = this.request.query;
    if (body.start) {
        param['start'] = body.start;
    }
    if (body.page) {
        param['page'] = body.page;
    }
    if (body.limit) {
        param['limit'] = body.limit;
    }
    let list = yield proxy.Note.getListenList(param);
    return result(this, {code: 900, list});
};

//用户查看专家回答过的小纸条列表
exports.getExpertAnsweredList = function *(next) {
    let param = {userID: this.state.userID, expert_id: this.params.userID};
    let body = this.request.query;
    if (body.start) {
        param['start'] = body.start;
    }
    if (body.page) {
        param['page'] = body.page;
    }
    if (body.limit) {
        param['limit'] = body.limit;
    }
    let list = yield proxy.Note.getExpertAnsweredList(param);
    return result(this, {code: 900, list});
};

//专家获取自己接到的小纸条列表
exports.expertList = function *(next) {
    let param = {userID: this.state.userID};
    let body = this.request.query;
    if (body.page) {
        param['page'] = body.page;
    }
    if (body.start) {
        param['start'] = body.start;
    }
    if (body.limit) {
        param['limit'] = body.limit;
    }
    if (body.status) {
        param['status'] = body.status.split(',');
    }
    yield proxy.MqttMsg.markPoint({userID: param.userID, type: 'note', status: param.status});
    let list = yield proxy.Note.expertList(param);
    return result(this, {code: 900, list});
};

//用户支付偷听小纸条内容
exports.listen = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    if (note.userID.toString() == this.state.userID || note.expert_id.toString() == this.state.userID) {
        return result(this, {code: 910, msg: '无法偷听自己的小纸条！'}, 400);
    }
    if (note.status != 'replied') {
        return result(this, {code: 910, msg: '小纸条状态不合法，无法偷听！'});
    }
    let pay_id = new ObjectID;
    let param = {
        pay_id: pay_id,
        userID: this.state.userID,
        note_id: note.note_id,
        type: 'listen',
        channel: this.request.body.channel || 'alipay',
        amount: 100,
        money: 100,
        currency: this.request.body.currency || 'cny',
        subject: this.request.body.subject || `偷听小纸条_${dateUtil.genDateStr()}`,
        desc: this.request.body.desc || ''
    };
    let extra = {};
    if (param.channel == 'wx_pub') {
        let sso = yield proxy.User.getSSO({userID: this.state.userID, type: 'weixin'});
        extra['open_id'] = sso.openid;
    }
    param.charge = yield doCharge({
        order_no: pay_id.toString(),
        app: {id: pingpp_app_id},
        channel: param.channel,
        amount: param.money,
        client_ip: ip.isV4Format(this.ip) ? this.ip : '127.0.0.1',
        currency: param.currency,
        subject: param.subject,
        body: `偷听小纸条_${dateUtil.genDateStr()}_${pay_id.toString()}`,
        description: param.desc,
        extra: extra
    });
    let pay = yield proxy.Pay.createPay(param);
    return result(this, {code: 900, pay_id: pay.pay_id, charge: param.charge});
    //thunkify charge 方法
    function doCharge(p, callback) {
        return function (callback) {
            pingpp.charges.create(p, callback);
        }
    }
};

//用户获取偷听小纸条的语音URL
exports.getReply = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    if (note.status != 'replied') {
        return result(this, {code: 910, msg: '小纸条状态不合法，无法偷听！'});
    }
    if (note.userID.toString() == this.state.userID || note.expert_id.toString() == this.state.userID) {
        return result(this, {code: 900, reply: note.reply, length: note.length});
    }
    // let pays = yield proxy.Pay.getPayByQuery({
    //     userID: this.state.userID,
    //     note_id: note_id,
    //     type: 'listen',
    //     client_status: 'success'
    // });
    for (let i = 0; i < note.list.length; i++) {
        if (note.list[i].toString() == this.state.userID) {
            return result(this, {code: 900, reply: note.reply, length: note.length});
        }
    }
    return result(this, {code: 910, msg: '尚未支付，无法收听！'});
};

//专家回复小纸条
exports.reply = function *(next) {
    let note_id = this.params.note_id;
    let note = yield proxy.Note.getNoteByID(note_id);
    if (!note) {
        return result(this, {code: 911, msg: '小纸条不存在！'}, 404);
    }
    if (note.status != 'paid') {
        return result(this, {code: 910, msg: '小纸条状态不合法，无法回答！'});
    }
    if (note.expert_id.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '不是提问给自己的小纸条，无法回复！'});
    }
    note.reply = this.request.body.reply;
    note.length = this.request.body.length;
    note.replyAt = new Date();
    note.status = 'replied';
    yield [note.save(), proxy.Money.noteReplied(note.note_id)];    //回答成功，获得收益

    //状态改变的通知
    mqttSend(note.userID, 'note', {note_id: note.note_id, status: note.status});

    return result(this, {code: 900});
};


