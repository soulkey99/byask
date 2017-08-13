/**
 * Created by MengLei on 2016-06-16.
 */
"use strict";
const proxy = require('../../common/proxy');
const model = require('../../common/model');
const eventproxy = require('eventproxy');

//首页，分类区块
exports.category = function *(next) {
    let list = yield proxy.Category.homeCategory();
    return result(this, {code: 900, list});
};

//首页，banner
exports.banner = function *(next) {
    let list = yield proxy.HomeBanner.getList(this.state.userID);
    return result(this, {code: 900, list});
};

//首页，推荐
exports.recommend = function *(next) {
    let list = [];  //热门列表
    let res = yield proxy.HomeRecommend.getRawList(['hot']);
    for (let i = 0; i < res.length; i++) {
        switch (res[i].category) {
            case 'hot': {
                if (res[i].type == 'user') {
                    let item = yield proxy.Topic.getUserOneTopic(res[i].dest, this.state.userID);
                    if (item) {
                        list.push(item);
                    }
                }
            }
                break;
        }
    }
    return result(this, {code: 900, list: [{tag: '热门', list: list}]});
};

exports.recommendNote = function*(next) {
    let noteid = [];
    let res = yield proxy.HomeRecommend.getRawList(['hotNote']);
    for (let i = 0; i < res.length; i++) {
        switch (res[i].category) {
            case 'hotNote':
                if (res[i].type == 'note') {
                    noteid.push(res[i].dest);
                }
                break;
        }
    }
    let list = yield proxy.Note.getNoteListByIDs(noteid, this.state.userID);
    return result(this, {code: 900, list});
};

//首页获取红点
exports.redpoint = function *(next) {
    let info = yield proxy.MqttMsg.point(this.state.userID);
    return result(this, {code: 900, info});
};

//搜索
exports.search = function *(next) {
    let param = {
        userID: this.state.userID,
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit
    };
    if (this.request.query.key) {
        param['key'] = this.request.query.key.trim();
    }
    let list = [];
    if (this.request.query.type == 'user') {
        list = yield proxy.User.search(param);
    } else {
        list = yield proxy.Topic.search(param);
    }
    return result(this, {code: 900, list});
};

//发现，话题
exports.discoverTopics = function *(next) {
    let query = this.request.query;
    let param = {
        start: query.start,
        page: query.page,
        limit: query.limit,
        userID: this.state.userID
    };
    let list = yield proxy.Topic.getDiscover(param);
    return result(this, {code: 900, list});
};

//发现，小纸条
exports.discoverNotes = function *(next) {
    let query = this.request.query;
    let param = {
        start: query.start,
        page: query.page,
        limit: query.limit,
        userID: this.state.userID
    };
    let list = yield proxy.Note.getDiscover(param);
    return result(this, {code: 900, list});
};

exports.advertise = function *(next) {
    let param = {
        platform: this.header['platform'] ? this.header['platform'].toLowerCase() : 'android',
        resolution: this.request.query.resolution ? this.request.query.resolution.toLowerCase() : ''
    };
    let list = yield proxy.Advertise.getCurrentAd(param);
    return result(this, {code: 900, list});
};

