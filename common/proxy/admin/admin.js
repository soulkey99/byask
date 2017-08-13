/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";
const model = require('../../model');

/**
 * 根据id获取管理员记录
 * @param userID
 * @returns {*}
 */
exports.getAdminByID = function*(userID) {
    return yield model.Admin.findById(userID);
};

/**
 * 通过用户名获取管理员信息
 * @param userName
 * @returns {*}
 */
exports.getAdminByUserName = function *(userName) {
    return yield model.Admin.findOne({userName: userName});
};

/**
 * 创建管理员账号
 * @param param = {userName: '', passwd: '', type: 'super/admin'}
 */
exports.createAdmin = function *(param) {
    let admin = new (model.Admin)();
    admin.userName = param.userName;
    admin.passwd = param.passwd;
    admin.intro = param.intro || '';
    admin.remark = param.remark || '';
    if (param.type) {
        admin.type = param.type;
    }
    if (param.sections) {
        admin.sections = JSON.parse(param.sections);
        admin.markModified('sections');
    }
    return yield admin.save();
};

exports.getList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {delete: false};
    if (param.delete == 'true') {
        delete(query.delete);
    }
    let res = yield model.Admin.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return res.map(item=>item.toInfo());
};

