/**
 * Created by MengLei on 2016-05-31.
 */
"use strict";
const crypto = require('crypto');
const sms = require('../../utils/sms');

//用户登录
exports.login = function *() {
    let body = this.request.body;
    let phone = body.phone;
    let passwd = body.passwd;
    let smscode = body.smscode;
    let user = yield proxy.User.getUserByPhone(phone);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (smscode) {
        let res = yield sms.check(phone, smscode);
        if (res.code) {
            return result(res, {code: res.code, msg: res.error || '短信验证码校验失败！'}, 400);
        }
    } else if (passwd) {
        if (!user.passwd) {
            return result(this, {code: 907, msg: '用户尚未设置登录密码，请使用短信登陆！'}, 400);
        }
        if (user.passwd != passwd) {
            return result(this, {code: 906, msg: '用户密码错误！'}, 400);
        }
    } else {
        return result(this, {code: 904, msg: '缺少smscode或者passwd字段！'}, 400);
    }
    if (user.block_util && user.block_util > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法登陆！'}, 400);
    }

    user.authSign = crypto.randomBytes(16).toString('hex');
    let info = yield user.toInfo();
    info.authSign = user.authSign;
    info.has_passwd = !!user.passwd;  //如果第三方登录通过，那么接口强制返回true
    user.lastLogin = Date.now();
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    proxy.Log.userLog({userID: info.userID, action: 'login', content: loginInfo});
    yield user.save();
    yield proxy.MqttUser.onLogin({userID: user.userID, platform: this.header['platform'].toLowerCase()});
    return result(this, {code: 900, info});
};

//用户第三方登录
exports.ssoLogin = function *(next) {
    let sso = null;
    let user = null;
    let body = this.request.body;
    if (!body.ssoType) {
        return result(this, {code: 904, msg: '缺少ssoType参数！'}, 400);
    }
    if (!body.openid) {
        return result(this, {code: 904, msg: '缺少openid参数！'}, 400);
    }
    switch (body.ssoType) {
        case 'weixin': {
            let check = yield require('./weixin').check(body.openid, body.access_token);
            if (!check.valid) {
                return result(this, {code: 913, msg: '第三方登录信息无效！'}, 400);
            }
            body.nick = check.nick;
            body.avatar = check.avatar;
            body.unionid = check.unionid;
            sso = yield proxy.User.getSSOByOpenid({unionid: body.unionid}, 400);
        }
            break;
        case 'qq':
        case 'weibo': {
            if (!body.openid) {
                return result(this, {code: 904, msg: '缺少openid参数！'}, 400);
            }
            sso = yield proxy.User.getSSOByOpenid({openid: body.openid, type: body.ssoType});
        }
            break;
        default: {
            return result(this, {code: 904, msg: 'ssoType参数错误！'}, 400);
        }
            break;
    }
    if (!sso) { //如果没有，那么创建用户，取用户的昵称和头像作为新账户的昵称头像
        user = yield proxy.User.createUser({
            nick: body.nick,
            avatar: body.avatar
        });
        yield proxy.User.createSSO({
            userID: user.userID,
            openid: body.openid,
            avatar: body.avatar,
            nick: body.nick,
            access_token: body.access_token,
            refresh_token: body.refresh_token,
            unionid: body.unionid,
            ssoType: body.ssoType,
            wxType: body.wxType
        });
    } else {    //这里，如果有记录，那么取用户信息，同时更新openid和access_token
        sso.openid = body.openid;
        sso.access_token = body.access_token;
        yield sso.save();
        user = yield proxy.User.getUserById(sso.userID);
        if (user.block_util && user.block_util > Date.now()) {
            return result(this, {code: 909, msg: '用户被封禁，无法登陆！'}, 400);
        }
    }
    user.authSign = crypto.randomBytes(16).toString('hex');
    let info = yield user.toInfo();
    info.authSign = user.authSign;
    info.has_passwd = true;  //如果第三方登录通过，那么接口强制返回true
    user.lastLogin = Date.now();
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    proxy.Log.userLog({userID: info.userID, action: 'ssoLogin', content: loginInfo});
    yield user.save();
    yield proxy.MqttUser.onLogin({userID: user.userID, platform: loginInfo.platform});
    return result(this, {code: 900, info});
};

//自动登录
exports.autoLogin = function *() {
    if (!this.request.body.userID) {
        return result(this, {code: 904, message: 'userID缺失！'}, 400);
    }
    if (!validator.isMongoId(this.request.body.userID)) {
        return result(this, {code: 904, message: 'userID格式不正确！'}, 400);
    }
    let user = yield proxy.User.getUserById(this.request.body.userID);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (user.block_util && user.block_util > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法登陆！'}, 400);
    }
    if (user.authSign != this.request.body.authSign) {
        return result(this, {code: 903, msg: '登陆信息失效，请重新登陆！'}, 400);
    }
    user.authSign = crypto.randomBytes(16).toString('hex');
    let info = yield user.toInfo();
    info.authSign = user.authSign;
    result(this, {code: 900, info});
    user.lastLogin = Date.now();
    user.save();
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    proxy.Log.userLog({userID: info.userID, action: 'autoLogin', content: loginInfo});
};

//用户注册
exports.register = function *() {
    let body = this.request.body;
    let phone = body.phone;
    let passwd = body.passwd;
    let nick = body.nick;
    let avatar = body.avatar;
    if (!passwd) {
        return result(this, {code: 904, msg: '未上传passwd字段！'}, 400);
    }
    if (!nick) {
        return result(this, {code: 904, msg: '未上传nick字段！'}, 400);
    }
    //建立byask中的user信息
    let user = yield proxy.User.createUser({
        phone, passwd, nick, avatar,
        authSign: crypto.randomBytes(16).toString('hex')
    });
    let info = yield user.toInfo();
    info.has_passwd = !!user.passwd;
    info.authSign = user.authSign;
    result(this, {code: 900, info});
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    proxy.Log.userLog({userID: info.userID, action: 'register', content: loginInfo});
    proxy.Promote.onReg(info.phone, info.userID);
};

//绑定、解绑第三方登录信息
exports.bindSSO = function *(next) {
    let body = this.request.body;
    if (!body.ssoType) {
        return result(this, {code: 904, msg: '缺少ssoType参数！'});
    }
    if (body.action == 'unbind') {
        let sso = yield proxy.User.getSSO({userID: this.state.userID, type: body.ssoType});
        for (let i = 0; i < sso.length; i++) {
            sso[i].valid = false;
            yield sso[i].save();
        }
    } else {
        if (!body.openid) {
            return result(this, {code: 904, msg: '缺少openid参数！'});
        }
        if (!body.access_token) {
            return result(this, {code: 904, msg: '缺少access_token参数！'});
        }
        if (body.ssoType == 'weixin') {
            let check = require('./weixin').check(body.openid, body.access_token);
            if (!check.valid) {
                return result(this, {code: 913, msg: '第三方登录信息无效！'});
            }
            body.nick = check.nick;
            body.avatar = check.avatar;
            body.unionid = check.unionid;
        } else {
            if (!body.avatar) {
                return result(this, {code: 904, msg: '缺少avatar参数！'});
            }
            if (!body.nick) {
                return result(this, {code: 904, msg: '缺少nick参数！'});
            }
        }
        let sso = yield proxy.User.getSSOByOpenid({ssoType: body.ssoType, openid: body.openid, unionid: body.unionid});
        if (sso && sso.userID.toString() != this.state.userID) {
            return result(this, {code: 901, msg: '第三方登陆信息已经绑定了其他用户！'}, 400);
        } else if (sso && sso.userID.toString() == this.state.userID) {
            //已绑定过本账号，不需要再做什么操作了
        } else {
            yield proxy.User.createSSO({
                userID: this.state.userID,
                ssoType: body.ssoType,
                openid: body.openid,
                unionid: body.unionid,
                access_token: body.access_token,
                refresh_token: body.refresh_token,
                avatar: body.avatar,
                nick: body.nick,
                expire: body.expire
            });
        }
    }
    return result(this, {code: 900});
};

//获取sso信息
exports.getSSO = function *(next) {
    let sso = yield proxy.User.getSSO({userID: this.state.userID});
    //
    return result(this, {code: 900, info: ['todo']});
};

//用户注销登陆
exports.logout = function *(next) {
    if (!this.request.body.userID) {
        return result(this, {code: 904, message: 'userID缺失！'}, 400);
    }
    if (!validator.isMongoId(this.request.body.userID)) {
        return result(this, {code: 904, message: 'userID格式不正确！'}, 400);
    }
    let user = yield proxy.User.getUserById(this.request.body.userID);
    if (!user) {
        return result(this, {code: 902, message: '用户不存在！'}, 404);
    }
    if (user.authSign != this.request.body.authSign) {
        return result(this, {code: 903, msg: '登陆信息失效，请重新登陆！'}, 400);
    }
    user.authSign = '';
    yield [user.save(), proxy.MqttUser.disconnected({clientid: user.userID, reason: 'logout'})];
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.ip
    };
    proxy.Log.userLog({userID: user.userID, action: 'logout', content: loginInfo});
    return result(this, {code: 900});
};

//获取用户个人信息
exports.info = function *(next) {
    let userID = this.params.userID || this.state.userID;
    if (!validator.isMongoId(userID)) {
        return result(res, {code: 904, msg: 'userID格式错误！'}, 400);
    }
    let user = yield proxy.User.getUserById(userID);
    let info = yield user.toInfo(this.state.userID);
    result(this, {code: 900, info});
};

//设置、修改密码
exports.passwd = function *(next) {
    let old_pass = this.request.body.old_passwd;
    let new_pass = this.request.body.new_passwd;
    if (!new_pass) {
        return result(this, {code: 904, msg: '请输入新密码！'}, 400);
    }
    let user = yield proxy.User.getUserById(this.state.userID);
    if (user.passwd) {    //如果原来有密码，那么就是修改密码，要校验原密码，如果原来没有密码，那么就是第一次设置，不需要校验原密码
        if (!old_pass) {
            return result(this, {code: 904, msg: '请输入旧密码！'}, 400);
        }
        if (old_pass != user.passwd) {
            return result(this, {code: 906, msg: '旧密码错误！'}, 400);
        }
    }
    user.passwd = new_pass;   //设置新密码
    yield user.save();
    return result(this, {code: 900, updateAt: Date.now()});
};

//重置密码
exports.resetPasswd = function*(next) {
    let phone = this.request.body.phone;
    let passwd = this.request.body.new_passwd;
    if (!passwd) {
        return result(this, {code: 904, msg: '请输入新密码！'}, 400);
    }
    let user = yield proxy.User.getUserByPhone(phone);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    user.passwd = passwd;
    yield user.save();
    return result(this, {code: 900, updateAt: Date.now()});
};

//获取专家自我介绍
exports.intro = function *(next) {
    let user = yield proxy.User.getUserById(this.params.userID);
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    return result(this, {code: 900, self_intro: user.expertInfo.self_intro, banner: user.expertInfo.banner});
};

//获取专家统计信息
exports.expertStats = function *(next) {
    let user = yield proxy.User.getUserById(this.state.userID);
    let userObj = user.toObject({getters: true});
    let stats = {
        total: {
            money: user.moneyInfo.total
        },
        order: {
            money: user.moneyInfo.order,
            finished: user.expertInfo.finished,
            rating: userObj.expertInfo.rating,
            confirm_rate: userObj.expertInfo.confirm_rate,
            confirm_rate_text: userObj.expertInfo.confirm_rate_text
        },
        note: {
            price: user.expertInfo.note_price,
            money: user.moneyInfo.note,
            replied: user.expertInfo.note_replied,
            listened: userObj.expertInfo.note_listened,
            confirm_rate: userObj.expertInfo.note_confirm_rate,
            confirm_rate_text: userObj.expertInfo.note_confirm_rate_text
        }
    };
    return result(this, {code: 900, stats});
};

//获取用户余额
exports.getMoney = function *(next) {
    let user = yield proxy.User.getUserById(this.state.userID);
    return result(this, {
        code: 900, money: {
            money: user.moneyInfo.money || 0,
            withdrawn: user.moneyInfo.withdrawn || 0,
            withdrawing: user.moneyInfo.withdrawing || 0
        }
    });
};

//关注、取消关注用户
exports.follow = function *(next) {
    if (!validator.isMongoId(this.params.userID)) {
        return result(this, {code: 904, msg: 'userID格式错误！'}, 400);
    }
    if (this.params.userID == this.state.userID) {
        return result(this, {code: 910, msg: '用户无法关注自己！'});
    }
    let param = {
        userID: this.state.userID,
        action: this.request.body.action,
        u_id: this.params.userID
    };
    yield proxy.User.doFollow(param);
    return result(this, {code: 900});
};

//获取关注用户列表
exports.followList = function *(next) {
    let param = {
        userID: this.state.userID
    };
    if (this.request.query.start) {
        param['start'] = this.request.query.start;
    }
    if (this.request.query.page) {
        param['page'] = this.request.query.page;
    }
    if (this.request.query.limit) {
        param['limit'] = this.request.query.limit;
    }
    let list = yield proxy.User.getFollows(param);
    return result(this, {code: 900, list});
};

//获取专家申请信息
exports.expertInfo = function *(next) {
    let apply = yield proxy.ExpertApply.lastApply(this.state.userID);
    if (!apply) {
        return result(this, {code: 911, msg: '暂时没有申请记录！'}, 404);
    }
    result(this, {code: 900, info: apply.toObject({getters: true})});
};

//获取专家收到的评论列表
exports.comments = function *(next) {
    if (!validator.isMongoId(this.params.userID)) {
        return result(this, {code: 904, msg: 'userID错误！'}, 400);
    }
    let param = {
        expert_id: this.params.userID,
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit
    };
    let list = yield proxy.Order.getExpertCommentList(param);
    return result(this, {code: 900, list});
};

exports.modify = function *(next) {
    let body = this.request.body;
    let user = yield proxy.User.getUserById(this.state.userID);
    if (body.nick != undefined) {
        user.nick = body.nick;
    }
    if (body.avatar != undefined) {
        user.avatar = body.avatar;
    }
    if (body.email != undefined) {
        user.email = body.email;
    }
    if (body.intro != undefined) {
        user.intro = body.intro;
    }
    if (body.name != undefined) {
        user.userInfo.name = body.name;
    }
    if (body.city != undefined) {
        user.userInfo.city = body.city;
    }
    if (body.title != undefined) {
        user.expertInfo.title = body.title;
    }
    if (body.card != undefined) {
        user.expertInfo.card = body.card;
    }
    if (body.company != undefined) {
        user.expertInfo.company = body.company;
    }
    if (body.major != undefined) {
        user.expertInfo.major = body.major.split(',');
    }
    if (body.self_intro != undefined) {
        user.expertInfo.self_intro = body.self_intro;
    }
    if (body.note_price != undefined) {
        user.expertInfo.note_price = body.note_price;
    }
    yield user.save();
    return result(this, {code: 900, updatedAt: new Date()});
};

//获取专家列表
exports.getExpertList = function *(next) {
    let param = {
        page: this.request.query.page,
        limit: this.request.query.limit,
        start: this.request.query.start
    };
    if (this.state.userID) {
        param['userID'] = this.state.userID;
    }
    if (this.params.categoryName) {
        param['categoryName'] = this.params.categoryName;
    }
    if (this.params.subCategoryName) {
        param['subCategoryName'] = this.params.subCategoryName;
    }
    let list = yield proxy.User.getExpertList(param);
    return result(this, {code: 900, list});
};

exports.applyExpertInfo = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.state.userID,
        name: body.name,
        company: body.company,
        title: body.title,
        work_year: body.work_year,
        city: body.city,
        card: body.card,
        banner: body.banner,
        avatar: body.avatar,
        note_price: body.note_price,
        major: [],
        category: [],
        self_intro: body.self_intro
    };
    if (this.request.body.major) {
        param.major = this.request.body.major.split(',');
    }
    let user = yield proxy.User.getUserById(this.state.userID);
    if (body.note_price) {  //修改小纸条价格，单位（分）
        user.expertInfo.note_price = body.note_price;
    }
    if (body.category) {
        param.category = JSON.parse(body.category);
    }
    if (user.expertInfo.status != 'verified') { //如果用户当前专家身份不是verified，那么改为pending
        user.expertInfo.status = 'pending';
    }
    // if (body.avatar) {
    //     user.avatar = body.avatar;
    // }
    yield user.save();

    let apply = yield proxy.ExpertApply.lastApply(this.state.userID);
    if (apply && apply.status == 'pending') {
        //如果传apply_id，那么就是直接修改，否则是重新创建一条记录
        param.apply_id = apply.apply_id;
    }

    apply = yield proxy.ExpertApply.editApply(param);
    return result(this, {code: 900, apply_id: apply.apply_id});
};

exports.pendingExpertInfo = function *(next) {
    let apply = yield proxy.ExpertApply.lastApply(this.state.userID);
    let user = yield proxy.User.getUserById(this.state.userID);
    // if (!apply || apply.status != 'pending') {
    //     return result(this, {}, 404);
    // }
    // if (!apply) {
    //     return result(this, {code: 911, msg: '要获取的内容不存在！'}, 404);
    // }
    let info = null;
    let d = new Date();
    if (apply && apply.status == 'pending') {
        info = apply.toObject({getters: true});
    } else if (user.expertInfo.status == 'verified') {
        info = {
            info: {
                self_intro: user.expertInfo.self_intro,
                company: user.expertInfo.company,
                category: user.expertInfo.category,
                major: user.expertInfo.major,
                banner: user.expertInfo.banner,
                city: user.userInfo.city,
                work_year: user.expertInfo.work_year,
                card: user.expertInfo.card,
                name: user.userInfo.name,
                avatar: user.avatar,
                title: user.expertInfo.title
            },
            userID: this.state.userID,
            status: 'verified',
            checkAt: d,
            createdAt: d,
            updatedAt: d
        };
    } else {
        info = {
            info: {
                self_intro: '',
                company: '',
                category: '',
                major: '',
                banner: '',
                city: '',
                work_year: '',
                card: '',
                name: '',
                avatar: '',
                title: ''
            },
            userID: this.state.userID,
            status: 'verified',
            checkAt: d,
            createdAt: d,
            updatedAt: d
        };
    }
    yield proxy.MqttMsg.markPoint({userID: this.state.userID, type: 'expert'});
    info.phone = this.state.user.phone;
    info.info.note_price = this.state.user.expertInfo.note_price;
    return result(this, {code: 900, info: info});
};
