/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const model = require('../../model');

/**
 * 查询banner列表
 * - list, 返回结果
 */
exports.getList = function *(userID) {
    let list = [];
    let res = yield model.HomeBanner.find({
        valid: true,
        startAt: {$lte: new Date()},
        endAt: {$gte: new Date()}
    }).sort({seq: 1});
    for (let i = 0; i < res.length; i++) {
        if (res[i].type == 'url') {
            list.push({type: res[i].type, dest: res[i].dest, img: res[i].img});
        } else if (res[i].type == 'user') {
            let item = {type: res[i].type, dest: res[i].dest, img: res[i].img, user: {}, topic: {}};
            let user = yield model.User.findById(res[i].dest);
            let topic = yield  model.Topic.findOne({userID: res[i].dest});
            if (user) {
                item.expert_info = yield user.toExpert(userID);
            }
            if (topic) {
                item.topic_info = yield topic.toTopic();
            }
            list.push(item);
        }
    }
    return list;
};

/**
 * 管理员端获取banner列表
 * @param param = {start: '', page: '', limit: '', valid: '', key: '', type: ''}
 * @returns {Array}
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
    let query = {};
    if (param.valid) {
        query['valid'] = param.valid == 'true';
    }
    if (param.key) {
        query['remark'] = {$regex: param.key};
    }
    if (param.type) {
        query['type'] = param.type;
    }
    let res = yield model.HomeBanner.find(query).sort({createdAt: -1}).skip(start).limit(count);
    for (let i = 0; i < res.length; i++) {
        let item = res[i].toItem();
        switch (item.type) {
            case 'user': {
                let user = yield model.User.findById(item.dest);
                if (user) {
                    item.expert_info = yield user.toExpert();
                }
            }
                break;
        }
        list.push(item);
    }
    return list;
};


/**
 * 新增、编辑banner
 * @param info = {banner_id: '', img: '', dest: '', remark: '', valid: '', seq: '', type: '', startAt: '', endAt: ''}
 * @returns {*}
 */
exports.editBanner = function *(info) {
    let banner = null;
    if (info.banner_id) {
        banner = yield model.HomeBanner.findById(info.banner_id);
    }
    if (!banner) {
        banner = new (model.HomeBanner)();
    }
    if (info.img != undefined) {
        banner.img = info.img;
    }
    if (info.dest != undefined) {
        banner.dest = info.dest;
    }
    if (info.remark != undefined) {
        banner.remark = info.remark || '';
    }
    if (banner.valid != undefined) {
        banner.valid = info.valid;
    }
    if (info.seq != undefined) {
        banner.seq = info.seq;
    }
    if (info.type != undefined) {
        banner.type = info.type;
    }
    if (info.startAt != undefined) {
        banner.startAt = info.startAt;
    }
    if (info.endAt != undefined) {
        banner.endAt = info.endAt;
    }
    return yield banner.save();
};

