/**
 * Created by MengLei on 2016-06-20.
 */
"use strict";
const model = require('../../model');

/**
 * 根据ID获取申请记录
 */
exports.getApplyByID = function (apply_id) {
    return model.ExpertApply.findById(apply_id);
};

/**
 * 管理员端获取pending状态的申请记录
 * @param param = {status: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.getPendingList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {status: 'pending'};
    if (param.status) {
        query['status'] = param.status;
    }
    let applies = yield model.ExpertApply.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < applies.length; i++) {
        let item = applies[i].toObject({getters: true});
        let user = yield proxy.User.getUserById(item.userID);
        item.expert_info = yield user.toExpert();
        item.expert_info.phone = user.phone;
        item.expert_info.status = user.expertInfo.status;
        list.push(item);
    }
    return list;
};


/**
 * 获取最后一条申请记录
 */
exports.lastApply = function *(userID) {
    return model.ExpertApply.findOne({userID: userID}).sort({updatedAt: -1});
};

/**
 * 申请专家资格param = {}
 */
exports.editApply = function *(param) {
    let apply = null;
    if (param.apply_id) {
        apply = yield model.ExpertApply.findById(param.apply_id);
        if (!apply) {
            return null;
        }
        if (apply.status != 'pending') {
            throw new Error('申请记录已被审核，无法修改！');
        }
    } else {
        apply = new (model.ExpertApply)();
        apply.userID = param.userID;
    }
    if (!apply.info) {
        apply.info = {};
    }
    apply.info.name = param.name;
    apply.info.company = param.company;
    apply.info.title = param.title;
    apply.info.work_year = param.work_year;
    apply.info.city = param.city;
    apply.info.card = param.card;
    apply.info.banner = param.banner;
    apply.info.avatar = param.avatar;
    apply.info.major = param.major;
    apply.info.self_intro = param.self_intro;
    apply.info.category = param.category;
    apply.info.note_price = param.note_price;
    apply.status = param.status || 'pending';
    return yield apply.save();
};

/**
 *管理员审核专家资格申请
 */
exports.verify = function *(apply_id, status) {
    let apply = yield model.ExpertApply.findById(apply_id);
    if (!apply) {
        throw new Error('apply_id对应的内容不存在！');
    }
    if (apply.status != 'pending') {
        throw new Error('申请记录已经审核过！');
    }
    apply.status = status;
    if (status == 'verified') {
        let user = yield model.User.findById(apply.userID);
        user.userInfo.name = apply.info.name;
        user.userInfo.city = apply.info.city;
        user.expertInfo.title = apply.info.title;
        user.expertInfo.company = apply.info.company;
        if (apply.info.card != undefined) {
            user.expertInfo.card = apply.info.card;
        }
        user.expertInfo.work_year = apply.info.work_year;
        user.expertInfo.banner = apply.info.banner;
        // user.avatar = apply.info.avatar;
        // user.expertInfo.note_price = apply.info.note_price;
        user.expertInfo.major = apply.info.major;
        user.expertInfo.category = apply.info.category;
        user.expertInfo.self_intro = apply.info.self_intro;
        user.expertInfo.status = 'verified';
        yield user.save();
    }
    return yield apply.save();
};

