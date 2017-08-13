/**
 * Created by MengLei on 2016-08-30.
 */
"use strict";
const wxUtil = require('./../utils/weixin');

//上传logo
exports.uploadLogo = function *(next) {
    let body = this.request.body;
    let wxRes = yield wxUtil.api.uploadLogo(body.tmpPath);
    return result(this, wxRes);
};

//add location

//获取客服聊天记录
exports.getRecords = function *(next) {
    let body = this.request.query;
    let wxRes = yield wxUtil.api.getRecords(body);
    return result(this, wxRes);
};

//

