/**
 * Created by MengLei on 2016-07-20.
 */
"use strict";

//获取指定用户信息
exports.getInfo = function *(next) {
    if (!validator.isMongoId(this.params.userID)) {
        return yield next;
    }
    let user = yield proxy.User.getUserById(this.params.userID);
    if (!user) {
        return result(this, {code: 902, msg: '对应用户不存在！'});
    }
    let info = yield user.toInfo();
    return result(this, {code: 900, info});
};

//搜索用户
exports.search = function *(next) {
    let body = this.request.query;
    let param = {phone: body.phone, nick: body.nick, name: body.name, start: body.start, limit: body.limit};
    if (body.getAll) {
        param['getAll'] = body.getAll;
    }
    if (body.getExpert) {
        param['getExpert'] = body.getExpert;
    }
    if (body.getBlack) {
        param['getBlack'] = body.getBlack;
    }
    let list = yield proxy.User.getAdminList(param);
    return result(this, {code: 900, list});
};

//创建用户
exports.create = function *(next) {
    let body = this.request.body;
    let user = yield proxy.User.getUserByPhone(body.phone);
    if (user) {
        return result(this, {code: 901, msg: '用户已经存在！'}, 400);
    }
    user = yield proxy.User.createUser({
        phone: body.phone,
        passwd: body.passwd || '',
        nick: body.nick || '',
        avatar: body.avatar || '',
        name: body.name || '',
        authSign: 'xxxx'
    });
    if (body.expert_status == 'verified') {   //如果要创建专家，那么需要额外填写这些信息
        user.userInfo.name = body.name;
        user.userInfo.city = body.city;
        user.expertInfo.title = body.title;
        user.expertInfo.company = body.company;
        user.expertInfo.card = body.card;
        user.expertInfo.work_year = body.work_year;
        user.expertInfo.note_price = body.note_price;
        user.expertInfo.banner = body.banner;
        if (body.category) {
            user.expertInfo.category = JSON.parse(body.category);
        }
        if (body.major) {
            user.expertInfo.major = body.major.split(',');
        } else {
            user.expertInfo.major = [];
        }
        user.expertInfo.self_intro = body.self_intro;
        user.expertInfo.status = 'verified';
        //同时对应创建一条申请记录(设置成已通过)
        yield proxy.ExpertApply.editApply({
            userID: user.userID,
            name: user.userInfo.name,
            company: user.expertInfo.company,
            title: user.expertInfo.title,
            work_year: user.expertInfo.work_year,
            city: user.userInfo.city,
            card: user.expertInfo.card,
            banner: user.expertInfo.banner,
            major: user.expertInfo.major,
            note_price: user.expertInfo.note_price,
            category: user.expertInfo.category,
            self_intro: user.expertInfo.self_intro,
            status: 'verified'
        });
    }
    yield user.save();
    return result(this, {code: 900, userID: user.userID});
};

//编辑用户信息
exports.update = function*(next) {
    if (!validator.isMongoId(this.params.userID)) {
        return yield next;
    }
    let body = this.request.body;
    let user = yield proxy.User.getUserById(this.params.userID || body.userID);
    if (!user) {
        return result(this, {code: 902, msg: '对应用户不存在！'});
    }
    body.userID = user.userID;
    user = yield proxy.User.adminEditUserInfo(body);
    // logger.trace('init user: ' + JSON.stringify(user));
    // if (body.nick != undefined) {
    //     user.nick = body.nick;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.avatar) {
    //     user.avatar = body.avatar;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.name != undefined) {
    //     user.userInfo.name = body.name;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.expert_status != undefined) {
    //     user.expertInfo.status = body.expert_status;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.city != undefined) {
    //     user.userInfo.city = body.city;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.title != undefined) {
    //     user.expertInfo.title = body.title;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.company != undefined) {
    //     user.expertInfo.company = body.company;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.card != undefined) {
    //     user.expertInfo.card = body.card;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.work_year != undefined) {
    //     user.expertInfo.work_year = body.work_year;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.banner != undefined) {
    //     user.expertInfo.banner = body.banner;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.category != undefined) {
    //     user.expertInfo.category = JSON.parse(body.category);
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.note_price != undefined) {
    //     user.expertInfo.note_price = body.note_price;
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.major != undefined) {
    //     if (body.major) {
    //         user.expertInfo.major = body.major.split(',');
    //     } else {
    //         user.expertInfo.major = [];
    //     }
    // }
    // logger.trace('modify user: ' + JSON.stringify(user));
    // if (body.self_intro != undefined) {
    //     user.expertInfo.self_intro = body.self_intro;
    // }
    // logger.trace('final user: ' + JSON.stringify(user));
    // yield user.save();
    return result(this, {code: 900, userID: user.userID});
};

//获取指定用户资金变动列表，type=order、note、listenNote、withdraw
exports.getMoneyList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit,
        startAt: body.startAt,
        endAt: body.endAt
    };
    if (validator.isMongoId(this.params.userID)) {
        param['userID'] = this.params.userID;
    }
    if (body.type) {
        param['type'] = body.type.split(',');
    }
    let list = yield proxy.Money.getAdminList(param);
    return result(this, {code: 900, list});
};

//获取用户提现列表
exports.getWithdrawList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit,
        startAt: body.startAt,
        endAt: body.endAt
    };
    if (body.phone) {
        let user = yield proxy.User.getUserByPhone(body.phone);
        if (user) {
            body.userID = user.userID;
        } else {
            return result(this, {code: 900, list: []});
        }
    }
    if (body.userID) {
        param['userID'] = body.userID;
    }
    if (body.type) {
        param['type'] = body.type.split(',');
    }
    let list = yield proxy.Money.getWithdrawList(param);
    return result(this, {code: 900, list});
};

//设置用户提现状态 {status: '', remark: ''}
exports.setWithdraw = function *(next) {
    let withdraw = yield proxy.Money.getWithdrawByID(this.params.withdraw_id);
    let body = this.request.body;
    if (!withdraw) {
        return result(this, {code: 911, msg: '对应的提现记录不存在！'});
    }
    if (withdraw.status != 'pending') {
        return result(this, {code: 910, msg: '提现记录状态不合法，无法提现！'});
    }
    switch (body.status == 'paid') {
        case 'paid':
            withdraw.status = 'paid';
            break;
        default:
            withdraw.status = 'fail';
            break;
    }
    if (body.remark) {
        withdraw.remark = body.remark;
    }
    withdraw.checkAt = new Date();
    yield withdraw.save();
    return result(this, {code: 900});
};

//给用户加入、移除黑名单
exports.addBlack = function *(next) {
    let body = this.request.body;
    let user = null;
    if (this.params.userID) {
        user = yield proxy.User.getUserById(this.params.userID);
    } else {
        if (body.phone) {
            user = yield proxy.User.getUserByPhone(body.phone);
        } else if (body.userID) {
            user = yield proxy.User.getUserById(body.userID);
        } else {
            return result(this, {code: 900, msg: '缺少参数phone或者userID！'});
        }
    }
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'});
    }
    let dbInfo = {
        platform: 'admin',
        ip: this.header['x-real-ip'] || this.ip
    };
    if (body.action == 'remove') {
        user.block_until = new Date();
        proxy.Log.userLog({userID: user.userID, action: 'removeblack', content: dbInfo});
    } else {
        user.authSign = 'zzz';
        user.block_util = body.block_util;
        user.block_reason = body.block_reason || '';
        dbInfo.desc = body.block_reason || '';
        proxy.Log.userLog({userID: user.userID, action: 'addblack', content: dbInfo});
    }
    yield user.save();
    return result(this, {code: 900, userID: user.userID});
};

//获取当前黑名单用户列表
exports.getBlackList = function *(next) {
    let body = this.request.body;
    let param = {
        type: body.type,
        start: body.start,
        page: body.page,
        limit: body.limit,
        sort: body.sort
    };
    let list = yield proxy.User.adminGetBlackList(param);
    return result(this, {code: 900, list});
};

//获取用户操作日志
exports.getUserLog = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit,
        action: body.action,
        imei: body.imei,
        mac: body.mac,
        ip: body.ip,
        platform: body.platform,
        client: body.client,
        channel: body.channel,
        startAt: body.startAt,
        endAt: body.endAt
    };
    if (validator.isMongoId(this.params.userID)) {
        param['userID'] = this.params.userID;
    } else if (body.phone) {
        let user = yield proxy.User.getUserByPhone(body.phone);
        if (!user) {
            return result(this, {code: 900, list: []});
        }
        body.userID = user.userID;
    }
    if (body.userID) {
        param['userID'] = body.userID;
    }
    let list = yield proxy.Log.getUserLog(param);
    return result(this, {code: 900, list});
};


