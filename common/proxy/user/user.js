/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";
const model = require('../../model');

/**
 * 根据userID返回用户信息
 * Callback;
 * - err, 数据库异常
 * - doc, 返回结果
 * @param {String} userID
 */
exports.getByUserById = function (userID) {
    return model.ByUser.findById(userID).exec();
};

/**
 * 获取所有专家的ID列表
 * @returns {*}
 */
exports.getAllExpertIDs = function *() {
    return yield model.User.distinct('_id', {'expertInfo.status': 'verified'});
};

/**
 * 获取所有的专家信息
 * @returns {*}
 */
exports.getAllExperts = function *() {
    return yield model.User.find({'expertInfo.status': 'verified'});
};


/**
 * 获取CallCall教师端的用户信息
 * @param userID
 * @returns {Promise}
 */
exports.getUserById = function (userID) {
    return model.User.findById(userID).exec();
};

/**
 * 通过手机号获取用户记录
 * @param phone
 * @returns {*}
 */
exports.getUserByPhone = function *(phone) {
    return yield model.User.findOne({phone: phone});
};

/**
 * 根据给定userID列表获取对应的用户角色信息
 * @param ids = []
 * @returns {*}
 */
exports.getUserInfos = function *(ids) {
    let res = yield model.User.find({_id: {$in: ids}});
    return res.map(i=>i.toUser());
};

/**
 * 根据sso的openid和type来获取user信息
 * @param param = {ssoType: '', openid: '', access_token: '', unionid: '', nick: '', avatar: '', expire: ''}
 * @returns {*}
 */
exports.getUserBySSO = function *(param) {
    let query = {type: param.ssoType, openid: param.openid, valid: true};
    // query[param.ssoType + '.openid'] = param.openid;
    let sso = yield model.UserSSO.findOne(query);
    if (!sso) {
        return null;
    } else {
        let needSave = false;   //标志位，是否需要保存sso记录
        if (param.access_token) {
            sso['access_token'] = param.access_token;
            needSave = true;
        }
        if (param.nick) {
            sso['nick'] = param.nick;
            needSave = true;
        }
        if (param.avatar) {
            sso['avatar'] = param.avatar;
            needSave = true;
        }
        if (param.expire) {
            sso['expire'] = param.expire;
            needSave = true;
        }
        if (param.unionid) {
            sso['unionid'] = param.unionid;
            needSave = true;
        }
        if (needSave) {
            yield sso.save();
        }
        return yield model.User.findById(sso.userID);
    }
};

/**
 * 创建sso登陆记录
 * @param param = {ssoType: '', openid: '', avatar: '', nick: '', access_token: '', expire: '', unionid: ''}
 * @returns {*}
 */
exports.createSSO = function *(param) {
    let sso = new (model.UserSSO)();
    sso.userID = param.userID;
    sso.type = param.ssoType;
    sso.nick = param.nick || '';
    sso.avatar = param.avatar || '';
    sso.openid = param.openid;
    sso.unionid = param.unionid || '';
    sso.access_token = param.access_token;
    sso.refresh_token = param.refresh_token;
    sso.expire_at = new Date(Date.now() + 7200000);
    sso.refresh_at = new Date();
    return yield sso.save();
};

/**
 * 获取sso记录
 * @param param = {userID: '', type: ''}
 * @returns {*}
 */
exports.getSSO = function *(param) {
    let query = {userID: param.userID, valid: true};
    if (param.type) {
        query['type'] = param.type;
    }
    return yield model.UserSSO.findOne(query).sort({createdAt: -1});
};

/**
 * 根据指定openid或者unionid获取sso记录
 * @param param = {ssoType: '', openid: '', unionid: ''}
 * @returns {*}
 */
exports.getSSOByOpenid = function *(param) {
    let query = {valid: true};
    if (param.unionid) {
        query['unionid'] = param.unionid;
    } else {
        query['openid'] = param.openid;
        query['type'] = param.ssoType;
    }
    return yield model.UserSSO.findOne(query);
};

/**
 * 根据查询条件返回用户列表
 * - list, 返回结果
 * @param {String} param = {nick: '', phone: '', start: '', page: '', limit: '', getExpert: '', getAll: ''}
 */
exports.getAdminList = function *(param) {
    let list = [];
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = model.User.find();
    if (param.phone) {
        query.find({phone: {$regex: param.phone}});
    } else if (param.name) {
        query.find({'userInfo.name': {$regex: param.name}});
    } else if (param.nick) {
        query.find({nick: {$regex: param.nick}});
    } else {
        if (param.getAll == 'true') {
            return [];
        }
    }
    if (param.getExpert == 'true') {
        query.where('expertInfo.status').equals('verified');
    } else if (param.getExpert == 'false') {
        query.find({'expertInfo.status': {$ne: 'verified'}});
    }
    if (param.getBlack == 'true') {
        query.find({'block_util': {$gte: new Date()}});
        query.sort({'block_util': 1});
    } else if (param.getBlack == 'history') {
        query.find({'block_util': {$lte: new Date()}});
        query.sort({'block_util': -1});
    }
    if (param.getAll != 'true') {
        query.skip(start).limit(count);
    }
    let res = yield query.exec();
    for (let i = 0; i < res.length; i++) {
        let item = {userID: res[i].userID, nick: res[i].nick, phone: res[i].phone, user: {}, expert: {}};
        item.user = res[i].toUser();
        item.expert_status = res[i].expertInfo.status;
        item.block_util = res[i].block_util;
        item.block_reason = res[i].block_reason;
        if (item.expert_status == 'verified') {
            item.expert = yield res[i].toExpert();
            item.expert.banner = res[i].expertInfo.banner;
            item.expert.self_intro = res[i].expertInfo.self_intro;
            item.expert.card = res[i].expertInfo.card;
        }
        list.push(item);
    }
    return list;
};


/**
 * 创建用户，info = {userID: '', phone: '', nick: '', avatar: '', name: '', authSign: ''}
 * @param info
 * @returns {Promise|*}
 */
exports.createUser = function (info) {
    let user = new (model.User)();
    // user._id = info.userID;
    user.phone = info.phone || '';
    user.passwd = info.passwd || '';
    user.nick = info.nick || '';
    user.avatar = info.avatar || '';
    user.userInfo.name = info.name || '';
    user.authSign = info.authSign || '';
    return user.save();
};

/**
 * 通过手机号获取用户配置信息（同CallCall教师）
 * @param phone
 * @returns {Promise}
 */
exports.getConfByPhone = function (phone) {
    return model.ByUserConf.findOne({phonenum: phone}).exec();
};

/**
 * 获取CallCall教师端的用户信息
 * @param phone
 * @returns {Promise}
 */
exports.getByUserByPhone = function (phone) {
    return model.ByUser.findOne({phone: phone}).exec();
};

/**
 * 创建CallCall教师端的用户，info = {phone: '', passwd: '', nick: '', avatar: '', name: ''}
 * @param info
 * @returns {Promise|*}
 */
exports.createByUser = function (info) {
    let byuser = new (model.ByUser)();
    byuser.phone = info.phone;
    byuser.passwd = info.passwd;
    byuser.nick = info.nick || '';
    byuser.userInfo.avatar = info.avatar || '';
    byuser.userInfo.name = info.name || '';
    return byuser.save();
};

exports.getByUserByEMail = function (email) {
    model.ByUser.findOne({email: email}).exec();
};

/**
 * 获取用户关注列表
 * @param {Object} param = {userID: '', page: '', limit: ''}
 * @returns {Array}
 */
exports.getFollows = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let follow = yield model.Follow.findById(param.userID, {list: {$slice: [start, count]}});
    let list = [];
    if (follow && follow.list) {
        let users = yield model.User.find({_id: {$in: follow.list}});
        for (let i = 0; i < users.length; i++) {
            let item = yield users[i].toExpert();
            item.is_follow = true;  //既然是获取关注列表，那么所有的用户都是已经关注的，就不用再去查一次数据库了
            list.push(item);
        }
    }
    return list;
};

/**
 * 关注、取消关注用户
 * @param param = {userID: '', action: '', u_id: ''}
 * @returns {*}
 */
exports.doFollow = function *(param) {
    let follow = yield model.Follow.findById(param.userID);
    if (!follow) {
        follow = new (model.Follow)();
        follow._id = param.userID;
    }
    if (param.action == 'un') {
        follow = yield model.Follow.findByIdAndUpdate(param.userID,
            {$pull: {list: param.u_id}}, {
                upsert: true,
                new: true
            });
    } else {
        follow = yield model.Follow.findByIdAndUpdate(param.userID,
            {$addToSet: {list: param.u_id}}, {
                upsert: true,
                new: true
            });
    }
    return follow;
};

/**
 * userID对应的用户是否关注过u_id对应的用户
 * @param userID
 * @param u_id
 * @returns {boolean}
 */
exports.isFollow = function *(userID, u_id) {
    if (userID == u_id) {
        return false;
    }
    let follow = yield model.Follow.findById(userID);
    if (!follow) {
        return false;
    }
    // follow.list.forEach(item=> {
    //     if (item.toString() == u_id) {
    //         return true
    //     }
    // });
    for (let i = 0; i < follow.list.length; i++) {
        if (follow.list[i].toString() == u_id) {
            return true;
        }
    }
    return false;
};

/**
 * 增加一个已完成订单数
 * @param param = {userID: '', rating: ''}
 */
exports.incFinish = function *(param) {
    let user = yield model.User.findById(param.userID);
    if (!user) {
        return null;
    }
    user.expertInfo.total_rating += Number.parseInt(param.rating);
    user.expertInfo.finished++;
    user.expertInfo.rating = (user.expertInfo.total_rating / user.expertInfo.finished).toFixed(1);
    return yield user.save();
};

/**
 * 记录push token
 * @param param = {userID: '', token: '', platform: ''}
 */
exports.setPushToken = function *(param) {
    if (!param.platform) {
        param.platform = param.token.length == 64 ? 'ios' : 'android';
    } else {
        param.platform = param.platform.toLowerCase();
    }
    let push = yield model.UserPushToken.findOne({token: param.token});
    if (push && push._id.toString() != param.userID) {
        yield model.UserPushToken.findByIdAndRemove(push._id);
        return yield model.UserPushToken.findByIdAndUpdate(param.userID, {
            $set: {
                token: param.token,
                platform: param.platform
            }
        }, {upsert: true, new: true});
    } else if (!push) {
        return yield model.UserPushToken.findByIdAndUpdate(param.userID, {
            $set: {
                token: param.token,
                platform: param.platform
            }
        }, {upsert: true, new: true});
    } else {
        push.token = param.token;
        push.platform = param.platform;
        return yield push.save();
    }
};

/**
 * 根据userID获取token记录
 * @param userID
 * @returns {*}
 */
exports.getPushToken = function *(userID) {
    return yield model.UserPushToken.findById(userID);
};

/**
 * 设置密保问题
 * @param param = {userID: '', answer1: '', answer2: '', answer3: ''}
 * @returns {*}
 */
exports.setSecureQuestion = function *(param) {
    let withdraw = yield model.UserWithdraw.findById(param.userID);
    if (!withdraw) {
        withdraw = new (model.UserWithdraw)();
        withdraw._id = param.userID;
    }
    if (param.answer1 != undefined) {
        withdraw.answer1 = param.answer1;
    }
    if (param.answer2 != undefined) {
        withdraw.answer2 = param.answer2;
    }
    if (param.answer3 != undefined) {
        withdraw.answer3 = param.answer3;
    }
    return yield withdraw.save();
};

/**
 * 获取指定用户的提现密保问题记录
 * @param userID
 * @returns {*}
 */
exports.getUserWithdraw = function *(userID) {
    let withdraw = yield model.UserWithdraw.findById(userID);
    if (!withdraw) {
        withdraw = new (model.UserWithdraw)();
        withdraw._id = userID;
        yield withdraw.save();
    }
    return withdraw;
};

/**
 * 清空指定用户的密保问题
 * @param userID
 * @returns {*}
 */
exports.clearSecureQuestion = function *(userID) {
    let withdraw = yield model.UserWithdraw.findById(userID);
    if (!withdraw) {
        withdraw = new (model.UserWithdraw)();
        withdraw._id = userID;
    }
    withdraw.answer1 = '';
    withdraw.answer2 = '';
    withdraw.answer3 = '';
    return yield withdraw.save();
};

/**
 * 设置指定用户的支付密码
 * @param param = {userID: '', passwd: ''}
 * @returns {*}
 */
exports.setPayPasswd = function *(param) {
    let withdraw = yield model.UserWithdraw.findById(param.userID);
    if (!withdraw) {
        withdraw = new (model.UserWithdraw)();
        withdraw._id = param.userID;
    }
    withdraw.passwd = param.passwd;
    return yield withdraw.save();
};

/**
 * 设置提现账户
 * @param param = {userID: '', type: '', }
 * @returns {*}
 */
exports.setWithdrawInfo = function *(param) {
    let withdraw = yield model.UserWithdraw.findById(param.userID);
    if (!withdraw) {
        withdraw = new (model.UserWithdraw)();
        withdraw._id = param.userID;
    }
    return yield withdraw.save();
};

/**
 * 搜索用户列表
 * @param param = {userID: '', start: '', page: '', limit: '', key: ''}
 * @returns {Array}
 */
exports.search = function *(param) {
    let query = {
        $or: [
            {'userInfo.name': {$regex: param.key}},
            // {'expertInfo.self_intro': {$regex: param.key}}
            {'expertInfo.major': {$regex: param.key}}
        ],
        'expertInfo.status': 'verified'
    };
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let users = yield model.User.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < users.length; i++) {
        let item = yield users[i].toExpert(param.userID);
        list.push(item);
    }
    return list;
};

/**
 * 根据指定条件获取专家列表
 * @param param = {categoryName: '', subCategoryName: ''， start: '', page: '', limit: ''}
 * @returns {Array}
 */
exports.getExpertList = function *(param) {
    let query = {'expertInfo.status': 'verified'};
    let list = [];
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    if (param.subCategoryName) {
        query['expertInfo.category.subCategory'] = param.subCategoryName;
    } else if (param.categoryName) {
        query['expertInfo.category.categoryName'] = param.categoryName;
    }
    let res = yield model.User.find(query).skip(start).limit(count);
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toExpert(param.userID);
        list.push(item);
    }
    return list;
};

/**
 * 管理员编辑用户信息
 * @param param = {userID: '', nick: '', avatar: '', name: '', expert_status: '', city: '', title: '',company: '', card: '', work_year: '', banner: '', category: '', note_price: '', major: '', self_intro: ''}
 * @returns {*}
 */
exports.adminEditUserInfo = function *(param) {
    let setObj = {};
    if (param.nick != undefined) {
        setObj['nick'] = param.nick;
    }
    if (param.avatar != undefined) {
        setObj['avatar'] = param.avatar;
    }
    if (param.name != undefined) {
        setObj['userInfo.name'] = param.name;
    }
    if (param.expert_status != undefined) {
        setObj['expertInfo.status'] = param.expert_status;
    }
    if (param.city != undefined) {
        setObj['userInfo.city'] = param.city;
    }
    if (param.title != undefined) {
        setObj['expertInfo.title'] = param.title;
    }
    if (param.company != undefined) {
        setObj['expertInfo.company'] = param.company;
    }
    if (param.card != undefined) {
        setObj['expertInfo.card'] = param.card;
    }
    if (param.work_year != undefined) {
        setObj['expertInfo.work_year'] = param.work_year;
    }
    if (param.banner != undefined) {
        setObj['expertInfo.banner'] = param.banner;
    }
    if (param.category != undefined) {
        setObj['expertInfo.category'] = JSON.parse(param.category);
    }
    if (param.note_price != undefined) {
        setObj['expertInfo.note_price'] = param.note_price;
    }
    if (param.major != undefined) {
        if (param.major) {
            setObj['expertInfo.major'] = param.major.split(',');
        } else {
            setObj['expertInfo.major'] = [];
        }
    }
    if (param.self_intro != undefined) {
        setObj['expertInfo.self_intro'] = param.self_intro;
    }
    return yield model.User.findByIdAndUpdate(param.userID, {$set: setObj}, {new: true, upsert: false});
};

/**
 * 管理员获取黑名单用户列表
 * @param param = {type: '', start: '', limit: '', sort: ''}
 * @returns {Array}
 */
exports.adminGetBlackList = function *(param) {
    let query = {block_util: {$gte: new Date()}};
    let sort = {block_util: 1};
    if (param.type == 'history') {  //type=history时取历史列表，否则取普通列表
        query = {block_util: {$lte: new Date()}};
        sort = {block_util: -1};//历史列表按解黑时间降序排列，普通列表按升序排列
    }
    if (param.sort) {   //如果手动指定列表排序，sort = asc 时升序，否则降序
        sort = param.sort == 'asc' ? {block_util: 1} : {block_util: -1};
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.User.find(query).sort(sort).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        list.push({
            userID: res[i].userID,
            nick: res[i].nick,
            phone: res[i].phone,
            expert_status: res[i].expert_status,
            block_util: res[i].block_util,
            block_reason: res[i].block_reason
        });
    }
    return list;
};

