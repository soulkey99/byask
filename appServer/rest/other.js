/**
 * Created by MengLei on 2016-06-23.
 */
"use strict";

//记录pushToken
exports.pushToken = function *(next) {
    let param = {
        userID: this.state.userID,
        token: this.request.body.token,
        platform: this.header['platform']
    };
    yield proxy.User.setPushToken(param);
    return result(this, {code: 900});
};

//检测更新信息
exports.checkUpdate = function *(next) {
    let param = {
        userID: this.state.userID,
        platform: this.header['platform']
    };
    let info = yield proxy.Update.check(param);
    return result(this, {code: 900, info});
};

//获取在线参数
exports.getOnlineConfig = function *(next) {
    let platform = this.header['platform'];
    let list = yield proxy.OnlineConfig.getList(platform);
    return result(this, {code: 900, list});
};

//用户反馈
exports.createFeedback = function *(next) {
    let param = {
        userID: this.state.userID,
        content: this.request.body.content,
        direction: 'u2a'
    };
    let feedback = yield proxy.Feedback.createFeedback(param);
    return result(this, {code: 900, feedback_id: feedback.feedback_id});
};

//获取反馈列表
exports.getFeedback = function *(next) {
    let param = {
        userID: this.state.userID,
        start: this.request.query.start,
        page: this.request.query.page,
        limit: this.request.query.limit
    };
    yield proxy.MqttMsg.markPoint({userID: param.userID, type: 'feedback'});
    let list = yield proxy.Feedback.getList(param);
    return result(this, {code: 900, list});
};

//热搜词汇
exports.hotWords = function *(next) {
    let param = {
        start: this.request.query.start,
        limit: this.request.query.limit
    };
    let list = yield proxy.HotWord.getHotWords(param);
    return result(this, {code: 900, list});
};

//分享接口
exports.share = function *(next) {
    let body = this.request.body;
    let param = {userID: this.state.userID, target: body.target};
    let type = 'share';
    let note = null;        //要分享的纸条信息
    let expert = null;      //要分享的专家信息
    let share_content = ''; //分享的文字
    let share_img = '';     //分享的图片
    switch (body.type) {
        case 'note': {
            param['type'] = 'note';
            param['param'] = {note_id: body.note_id};
            type += 'note';
            note = yield proxy.Note.getNoteByID(body.note_id);
            if (!note) {
                return result(this, {code: 911, msg: '要分享的小纸条不存在！'});
            }
            expert = yield proxy.User.getUserById(note.expert_id);
        }
            break;
        case 'user':
        default: {
            param['type'] = 'user';
            param['param'] = {userID: body.userID};
            type += 'user';
            expert = yield proxy.User.getUserById(body.userID);
            if (!expert) {
                return result(this, {code: 911, msg: '要分享的达人不存在！'});
            }
        }
            break;
    }
    let config = yield proxy.SysConfig.getConfigByType(type);
    if (!config) {
        config = {
            param: {
                title: '问答APP',
                user_content: '问答APP欢迎您',
                expert_content: '问答APP欢迎您',
                url: process.NODE_ENV == 'production' ? 'https://www.baidu.com/' : 'https://test.soulkey99.com:9071/share/shareNote.html?share_id={{share_id}}'
            }
        };    //默认分享配置
    }
    let share_title = config.param.title;
    switch (body.type) {
        case 'note':
            if (this.state.userID == expert.userID) { //专家分享自己
                share_content = config.param.expert_content.replace('{{note_content}}', note.content).replace('{{expert_name}}', expert.userInfo.name).replace('{{expert_title}}', expert.expertInfo.title);
            } else {    //用户分享专家
                share_content = config.param.user_content.replace('{{note_content}}', note.content).replace('{{expert_name}}', expert.userInfo.name).replace('{{expert_title}}', expert.expertInfo.title);
            }
            share_img = expert.avatar;
            break;
        case 'user':
        default:
            if (this.state.userID == expert.userID) { //专家分享自己
                share_content = config.param.expert_content.replace('{{expert_name}}', expert.userInfo.name).replace('{{expert_title}}', expert.expertInfo.title);
            } else {    //用户分享专家
                share_content = config.param.user_content.replace('{{expert_name}}', expert.userInfo.name).replace('{{expert_title}}', expert.expertInfo.title);
            }
            share_img = expert.avatar;
            break;
    }
    param['param']['share_title'] = share_title;
    param['param']['share_content'] = share_content;
    let share = yield proxy.Share.create(param);
    let share_url = config.param.url.replace('{{share_id}}', share.share_id);
    return result(this, {
        code: 900,
        share_id: share.share_id,
        img: share_img || config.param.img,
        share_title,
        share_content,
        share_url
    });
};

//获取分享内容
exports.getShare = function *(next) {
    if (!validator.isMongoId(this.params.share_id)) {
        return result(this, {code: 904, msg: 'share_id格式错误！'});
    }
    let share = yield proxy.Share.getShareById(this.params.share_id);
    if (!share) {
        return result(this, {code: 911, msg: '对应的分享记录不存在！'});
    }
    let info = {
        type: share.type
    };
    switch (share.type) {
        case 'note':
            info['note_id'] = share.param.note_id;
            break;
        case 'user':
        default:
            info['userID'] = share.param.userID;
            break;
    }
    return result(this, {code: 900, info});
};

//推广页面填写手机号
exports.promote = function *(next) {
    if (!this.params.shareCode || !this.request.body.phone) {
        return result(this, {code: 904, msg: '参数不足！'}, 400);
    }
    yield proxy.Promote.promote({
        shareCode: this.params.shareCode,
        phone: this.request.body.phone,
        ua: this.header['user-agent'],
        ip: this.header['x-real-ip'] || this.ip
    });
    return result(this, {code: 900});
};

//下载最新线上版本（安卓、ios）
exports.download = function *(next) {
    let param = {
        platform: checkSystem(this.header['user-agent'])
    };
    let info = {url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soulkey.calltalent'};
    if (param.platform == 'android') {
        info = yield proxy.Update.check(param);
        if (!info.url) {
            info.url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soulkey.calltalent';
        }
    }
    // else if (param.platform == 'ios') {
    //     info.url = 'itms-apps://itunes.apple.com/cn/app/wen-da/id1144390830?mt=8';
    // }

    return this.redirect(info.url);
    function checkSystem(ua) {
        var uaMap = {
            'android': /Android/i,
            'ios': /(?:iPhone|iPad)/i
        };
        for (var i in uaMap) {
            if (uaMap[i].test(ua)) {
                return i;
            }
        }
        return null;
    }
};
