/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const model = require('../../model');

/**
 * 根据ID获取推荐记录
 * @param id
 * @returns {*}
 */
exports.getRecommendById = function *(id) {
    return yield model.HomeRecommend.findById(id);
};

/**
 * 查询推荐列表
 * - list, 返回结果
 */
exports.getRawList = function *(category) {
    if (!category) {
        category = ['hot'];
    }
    let now = new Date();
    return yield model.HomeRecommend.find({
        category: {$in: category},
        $or: [{
            special: true,
            valid: true,
            startAt: {$lte: now},
            endAt: {$gte: now}
        }, {
            special: false
        }]
    });
};

/**
 * 获取管理员端的推荐列表
 * @param param = {start: '', page: '', limit: '', valid: '', ad: '', special: '', key: '', type: ''}
 * @returns {Array}
 */
exports.getAdminList = function*(param) {
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
    if (param.type) {
        query['type'] = param.type;
    }
    if (param.key) {
        query['remark'] = {$regex: param.key};
    }
    if (param.ad) {
        query['ad'] = param.ad == 'true';
    }
    if (param.special) {
        query['special'] = param.special == 'true';
    }
    let res = yield model.HomeRecommend.find(query).sort({createdAt: -1}).skip(start).limit(count);
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
            case 'note':
                item.note_info = yield require('../topic/note').getOneNoteInfo(item.dest);
                break;
        }
        list.push(item);
    }
    return list;
};

/**
 * 新增、编辑推荐列表
 * @param info = {recommend_id: '', category: 'hot/hotNote', type: '', dest: '', remark: '', seq: '', special: '', ad: '', valid: '', startAt: '', endAt: ''}
 * @returns {*}
 */
exports.createRecommend = function *(info) {
    let recommend = new (model.HomeRecommend)();
    if (info.category != undefined) {
        recommend.category = info.category;
    }
    if (info.type != undefined) {
        recommend.type = info.type;
    }
    if (info.dest != undefined) {
        recommend.dest = info.dest;
    }
    if (info.remark != undefined) {
        recommend.remark = info.remark;
    }
    if (info.seq != undefined) {
        recommend.seq = info.seq;
    }
    if (info.special != undefined) {
        recommend.special = info.special == 'true';
    }
    if (info.ad != undefined) {
        recommend.ad = info.ad == 'true';
    }
    if (info.valid != undefined) {
        recommend.valid = info.valid == 'true';
    }
    if (info.startAt) {
        recommend.startAt = info.startAt;
    }
    if (info.endAt) {
        recommend.endAt = info.endAt;
    }
    return yield recommend.save();
};

