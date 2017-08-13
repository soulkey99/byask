/**
 * Created by MengLei on 2016-07-07.
 */
"use strict";

//管理员登陆
exports.login = function *(next) {
    let body = this.request.body;
    let admin = yield proxy.Admin.getAdminByUserName(body.userName);
    if (!admin) {
        return result(this, {code: 902, msg: '登陆失败，用户不存在！'});
    }
    if (admin.delete) {
        return result(this, {code: 910, msg: '用户已经被删除，请联系管理员！'})
    }
    if (body.passwd == admin.passwd) {
        let info = admin.toInfo();
        this.session.user = info;
        this.session.userID = info.userID;
        return result(this, {code: 900, info});
    } else {
        return result(this, {code: 906, msg: '登陆密码错误！'});
    }
};
//管理员注销
exports.logout = function *(next) {
    delete (this.session.userID);
    delete(this.session.user);
    return result(this, {code: 900});
};

//管理员修改密码
exports.passwd = function *(next) {
    let body = this.request.body;
    let admin = yield proxy.Admin.getAdminByID(this.session.userID);
    if (admin.passwd != body.old_passwd) {
        return result(this, {code: 906, msg: '旧密码错误！'})
    }
    admin.passwd = body.new_passwd;
    yield admin.save();
    return result(this, {code: 900});
};

//创建管理员
exports.createAdmin = function *(next) {
    let body = this.request.body;
    if (this.session.user.type != 'super') {
        return result(this, {code: 910, msg: '没有权限！'});
    }
    let admin = yield proxy.Admin.getAdminByUserName(body.userName);
    if (admin) {
        return result(this, {code: 901, msg: '用户已经存在，无法创建！'});
    }
    admin = yield proxy.Admin.createAdmin({
        userName: body.userName,
        passwd: body.passwd,
        intro: body.intro,
        remark: body.remark,
        type: body.type,
        sections: body.sections
    });
    return result(this, {code: 900, userID: admin.userID});
};

//修改管理员信息
exports.editAdmin = function *(next) {
    let body = this.request.body;
    if (this.session.user.type != 'super') {
        return result(this, {code: 910, msg: '没有权限！'});
    }
    let admin = yield proxy.Admin.getAdminByID(this.params.userID);
    if (!admin) {
        return result(this, {code: 902, msg: '用户不存在，无法修改！'});
    }
    if (body.passwd) {
        admin.passwd = body.passwd;
    }
    if (body.intro != undefined) {
        admin.intro = body.intro;
    }
    if (body.remark != undefined) {
        admin.remark = body.remark;
    }
    if (body.sections != undefined) {
        admin.sections = JSON.parse(body.sections);
        admin.markModified('sections');
    }
    if (body.delete != undefined) {
        admin.delete = body.delete == 'true';
    }
    yield admin.save();
    return result(this, {code: 900, userID: admin.userID});
};

//获取管理员列表
exports.getAdminList = function *(next) {
    let body = this.request.body;
    let param = {
        start: body.start,
        page: body.page,
        limit: body.limit,
        delete: body.delete
    };
    let list = yield proxy.Admin.getList(param);
    return result(this, {code: 900, list});
};




