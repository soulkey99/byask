/**
 * Created by MengLei on 2016-08-22.
 */
"use strict";
const model = require('./../../model');

/**
 * 根据ID获取广告记录
 * @param id
 * @returns {*}
 */
exports.getAdById = function *(id) {
    return yield model.Advertise.findById(id);
};

/**
 * 获取当前客户端的广告
 * @param param = {time: '', platform: '', resolution: ''}
 * @returns {{pop: boolean, splash: Array, banner: Array, home: Array}}
 */
exports.getCurrentAd = function *(param) {
    let query = {valid: true};
    if (!param) {
        param = {};
    }
    if (param.time) {
        query['startAt'] = {$lte: new Date(param.time)};
        query['endAt'] = {$gte: new Date(param.time)};
    } else {
        query['startAt'] = {$lte: new Date()};
        query['endAt'] = {$gte: new Date()};
    }
    if (param.platform) {
        query['platform'] = {$all: [param.platform.toLowerCase()]};
        if (param.platform.toLowerCase() == 'ios') {
            query['$or'] = [{
                type: 'splash',
                resolution: (!!param.resolution ? (param.resolution.toLowerCase()) : 'iphone5')
            }, {
                type: {$ne: 'splash'}
            }];
        }
    }
    let list = {pop: false, splash: [], banner: [], home: []};
    let res = yield model.Advertise.find(query).sort({startAt: -1, createdAt: -1});
    res.sort((a, b)=>a.seq - b.seq);
    for (let i = 0; i < res.length; i++) {
        switch (res[i].type) {
            case 'banner':
                list.banner.push(res[i].toContent());
                break;
            case 'splash':
                list.splash.push(res[i].toContent());
                break;
            case 'homePop':
                list.pop = true;
                list.home.unshift(res[i].toContent());
                break;
            case 'homeHide':
                list.home.push(res[i].toContent());
                break;
            default:
                break;
        }
    }
    return list;
};

/**
 * 根据指定条件获取列表
 * @param param = {start: '', limit: '', page: '', valid: '', platform: '', type: ''}
 * @returns {*}
 */
exports.getList = function *(param) {
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
    if (param.platform) {
        query['platform'] = {$all: [param.platform]};
    }
    if (param.type) {
        query['type'] = param.type;
    }
    let res = yield model.Advertise.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return res.map(i=>i.toInfo());
};

/**
 * 新增、编辑广告
 * @param param = {ad_id: '', startAt: '', endAt: '', type: '', platform: '', valid: '', remark: '', content_type: '', content_dest: '', content_text: '', img: '', seq: '', resolution: ''}
 * @returns {*}
 */
exports.editAd = function *(param) {
    if (param.ad_id) {
        let setObj = {};
        if (param.startAt) {
            setObj['startAt'] = param.startAt;
        }
        if (param.endAt) {
            setObj['endAt'] = param.endAt;
        }
        if (param.type) {
            setObj['type'] = param.type;
        }
        if (param.platform) {
            setObj['platform'] = param.platform.split(',');
        }
        if (param.valid) {
            setObj['valid'] = param.valid == 'true';
        }
        if (param.remark) {
            setObj['remark'] = param.remark;
        }
        if (param.content_type) {
            setObj['content.type'] = param.content_type;
        }
        if (param.content_dest) {
            setObj['content.dest'] = param.content_dest;
        }
        if (param.content_text) {
            setObj['content.text'] = param.content_text;
        }
        if (param.content_img) {
            setObj['content.img'] = param.content_img;
        }
        if (param.seq) {
            setObj['seq'] = param.seq;
        }
        if (param.resolution) {
            setObj['resolution'] = param.resolution;
        }
        return yield model.Advertise.findByIdAndUpdate(param.ad_id, {$set: setObj}, {new: true});
    } else {
        let ad = new (model.Advertise)();
        if (param.startAt) {
            ad.startAt = param.startAt;
        }
        if (param.endAt) {
            ad.endAt = param.endAt;
        }
        if (param.type) {
            ad.type = param.type;
        }
        if (param.platform) {
            ad.platform = param.platform.split(',');
        }
        if (param.valid) {
            ad.valid = param.valid == 'true';
        }
        if (param.remark) {
            ad.remark = param.remark;
        }
        if (param.content_type) {
            ad.content.type = param.content_type;
        }
        if (param.content_dest) {
            ad.content.dest = param.content_dest;
        }
        if (param.content_text) {
            ad.content.text = param.content_text;
        }
        if (param.content_img) {
            ad.content.img = param.content_img;
        }
        if (param.seq) {
            ad.seq = param.seq;
        }
        if (param.resolution) {
            ad.resolution = param.resolution;
        }
        return yield ad.save();
    }
};