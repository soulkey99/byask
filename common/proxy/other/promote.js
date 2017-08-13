/**
 * Created by MengLei on 2016-08-18.
 */
"use strict";
const model = require('../../model');

/**
 * 获取用户的分享码，有的话直接返回，如果没有，就生成一个
 * @param userID
 * @returns {*}
 */
exports.getShareCode = function *(userID) {
    let shareCode = yield model.ShareCode.findById(userID);
    if (shareCode) {
        return shareCode;
    }
    shareCode = new (model.ShareCode)();
    shareCode.userID = userID;
    shareCode.type = 'user';
    shareCode.shareCode = yield genCode();
    return yield shareCode.save();
};

/**
 * 管理员手动生成一个推广码
 * @param param = {desc: ''}
 * @returns {*}
 */
exports.genShareCode = function *(param) {
    let shareCode = new (model.ShareCode)();
    shareCode.desc = param.desc;
    shareCode.shareCode = yield genCode();
    return yield shareCode.save();
};

/**
 * 根据shareCode获取对应的记录
 * @param shareCode
 * @returns {*}
 */
exports.getShareCode = function *(shareCode) {
    return yield model.ShareCode.findOne({shareCode: shareCode});
};

/**
 * 获取推广码列表以及对应的数据
 * @param param = {key: 'desc关键字', startAt: '', endAt: ''}
 * @returns {Array}
 */
exports.getCodeList = function *(param) {
    let query = {type: 'promoter'};
    if (param.key) {
        query['desc'] = {$regex: param.key};
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.ShareCode.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = res[i].toInfo();
        let query = {shareCode: item.shareCode};
        if (param.startAt && param.endAt) {
            query['createdAt'] = {$gte: new Date(param.startAt), $lte: new Date(param.endAt)};
        } else if (param.startAt) {
            query['createdAt'] = {$gte: new Date(param.startAt)};
        } else if (param.endAt) {
            query['createdAt'] = {$lte: new Date(param.endAt)}
        }
        let res2 = yield [
            model.Promote.count(Object.assign({}, query, {new: true})),
            model.Promote.count(Object.assign({}, query, {new: true, regAt: {$ne: null}, userID: {$ne: null}}))
        ];
        item.new = res2[0];
        item.reg = res2[1];
        list.push(item);
    }
    return list;
};

/**
 * 记录一个推广
 * @param param = {phone: '', ua: '', ip: '', shareCode: ''}
 * @returns {*}
 */
exports.promote = function *(param) {
    let promote = yield model.Promote.findOne({phone: param.phone});
    if (promote) {
        promote.count++;
        return yield promote.save();
    }
    promote = new (model.Promote)();
    let user = yield model.User.findOne({phone: param.phone});
    promote.phone = param.phone;
    promote.ua = param.ua || '';
    promote.ip = param.ip || '';
    promote.shareCode = param.shareCode;
    promote.new = !user;
    return yield promote.save();
};

/**
 * 记录注册
 * @param phone
 * @param userID
 */
exports.onReg = function *(phone, userID) {
    model.Promote.findOneAndUpdate({phone: phone}, {
        $set: {
            userID: userID,
            regAt: new Date()
        }
    }, {new: true}).exec();
};

/**
 * 管理员获取指定推广码的推广数据
 * @param param = {startAt: '', endAt: '', shareCode: ''}
 * @returns {Object} {total: '独立手机号数', new: '新手机号数', reg: '注册数', count: '点击下载数'}
 */
exports.adminGetStat = function *(param) {
    let query = {};
    if (param.startAt && param.endAt) {
        query['createdAt'] = {$gte: new Date(param.startAt), $lte: new Date(param.endAt)};
    } else if (param.startAt) {
        query['createdAt'] = {$gte: new Date(param.startAt)};
    } else if (param.endAt) {
        query['createdAt'] = {$lte: new Date(param.endAt)}
    }
    if (param.shareCode) {
        query['shareCode'] = param.shareCode;
    }
    let res = yield [
        model.Promote.count(query),
        model.Promote.count(Object.assign({}, query, {new: true})),
        model.Promote.count(Object.assign({}, query, {new: true, regAt: {$ne: null}, userID: {$ne: null}})),
        agg([{$match: query}, {$group: {"_id": "$shareCode", total: {$sum: "$count"}}}])
    ];
    return {
        total: res[0],
        new: res[1],
        reg: res[2],
        count: res[3][0] ? res[3][0] .total : 0
    }
};

/**
 * 管理员端获取特定分享码的邀请列表
 * @param param = {startAt: '', endAt: '', shareCode: '', type: 'new/reg', start: '', limit; ''}
 * @returns {*}
 */
exports.adminGetList = function *(param) {
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
        query['createdAt'] = {$lte: new Date(param.endAt)}
    }
    if (param.shareCode) {
        query['shareCode'] = param.shareCode;
    }
    switch (param.type){
        case 'new':
            query['new'] = true;
            break;
        case 'reg':
            query['regAt'] = {$ne: null};
            query['userID'] = {$ne: null};
            break;
    }
    if (param.new) {
        query['new'] = param.new == 'true';
    }
    if (param.reg == 'true') {
        query['regAt'] = {$ne: null};
        query['userID'] = {$ne: null};
    }
    let res = yield model.Promote.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return res.map(i=>i.toInfo());
};

function* genCode(charsLength, chars) {
    var length = 5;
    if (charsLength) {
        length = charsLength;
    }
    //默认密码集，已排除掉容易混淆的字母与数字，例如I,l,1,0,o,O
    var charsSets = "aAbBcC2dDeEfF3gGhHiJ4jKkLmM5nNpPqQ6rRsStT7uUvVwW8xXyYzZ9";
    if (chars) {
        charsSets = chars;
    }
    var randomChars = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * charsSets.length);
        randomChars += charsSets.charAt(i);
    }
    let res = yield model.ShareCode.findOne({shareCode: randomChars});
    if (res) {
        return genCode(charsLength, chars);
    } else {
        return randomChars;
    }
}

function agg(pipe, callback) {
    return function (callback) {
        model.Promote.aggregate(pipe, callback);
    }
}