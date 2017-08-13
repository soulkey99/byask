/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";
const sendSMS = require('../../utils/sms').send;

//获取待审核专家申请记录
exports.getApplyList = function *(next) {
    let body = this.request.query;
    let param = {
        start: body.start,
        limit: body.limit
    };
    if (body.status) {
        param['status'] = body.status;
    }
    let list = yield proxy.ExpertApply.getPendingList(param);
    return result(this, {code: 900, list});
};

//审核专家资格
exports.checkExpert = function *(next) {
    let body = this.request.body;
    let apply = yield proxy.ExpertApply.getApplyByID(body.apply_id);
    if (!apply) {
        return result(this, {code: 911, msg: '申请记录不存在！'}, 404);
    }
    if (apply.status != 'pending') {
        return result(this, {code: 910, msg: '这条记录已经审核过！'}, 400);
    }
    apply.status = body.status;
    apply.checkAt = new Date();
    let user = yield proxy.User.getUserById(apply.userID);
    if (body.status == 'verified') {
        if (user.expertInfo.status == 'verified') {
            //mqtt通知以及短信通知
            mqttSend(user.userID, 'expert', {status: 'verified', content: 'update'});
            if (process.NODE_ENV == 'production') {
                yield sendSMS({phone: user.phone, template: 'expert_pass', action: '信息更新'});
            }
        } else {
            //mqtt通知以及短信通知
            mqttSend(user.userID, 'expert', {status: 'verified', content: 'apply'});
            user.expertInfo.status = 'verified';
            if (process.NODE_ENV == 'production') {
                yield sendSMS({phone: user.phone, template: 'expert_pass', action: '申请'});
            }
        }
        user = yield proxy.User.adminEditUserInfo({
            userID: user.userID,
            expert_status: 'verified',
            title: apply.info.title,
            avatar: apply.info.avatar,
            name: apply.info.name,
            card: apply.info.card,
            work_year: apply.info.work_year,
            city: apply.info.city,
            banner: apply.info.banner,
            major: apply.info.major.join(','),
            category: JSON.stringify(apply.info.category),
            company: apply.info.company,
            self_intro: apply.info.self_intro
        });
        // user.expertInfo.status = 'verified';
        // user.expertInfo.title = apply.info.title;
        // user.avatar = apply.info.avatar;
        // user.userInfo.name = apply.info.name;
        // user.expertInfo.card = apply.info.card;
        // user.expertInfo.work_year = apply.info.work_year;
        // user.userInfo.city = apply.info.city;
        // user.expertInfo.banner = apply.info.banner;
        // user.expertInfo.major = apply.info.major;
        // user.expertInfo.category = apply.info.category;
        // user.expertInfo.company = apply.info.company;
        // user.expertInfo.self_intro = apply.info.self_intro;
        // yield user.save();
    } else {
        apply.rejectReason = !!body.reason ? body.reason.split(',') : [];
        //mqtt通知以及短信通知
        mqttSend(user.userID, 'expert', {status: 'fail', content: body.reason || ''});
        if (process.NODE_ENV == 'production') {
            yield sendSMS({phone: user.phone, template: 'expert_reject', result: body.reason});
        }
    }
    yield apply.save();

    return result(this, {code: 900});
};

