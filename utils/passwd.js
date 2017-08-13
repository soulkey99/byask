/**
 * Created by MengLei on 2016-06-15.
 */
"use strict";
const proxy = require('../common/proxy');

exports.middle = function *(next) {
    let phone = this.request.body.phone;
    let passwd = this.request.body.passwd;
    if (!passwd) {
        return result(this, {code: 904, msg: '缺少passwd字段！'}, 400);
    }
    try {
        let user = yield proxy.ByUser.getByUserByPhone(phone);
        if (!user) {
            return result(this, {code: 902, msg: '用户不存在！'}, 404);
        }
        if (user.userInfo.ext_info.first) {
            return result(this, {code: 902, msg: '用户尚未注册！'}, 404);
        }
        if (!user.passwd) {
            return result(this, {code: 907, msg: '用户尚未设置登录密码，请使用短信登陆！'}, 400);
        }
        if (user.passwd != passwd) {
            return result(this, {code: 906, msg: '用户尚密码错误！'}, 400);
        }
        yield next;
    } catch (ex) {
        return result(this, {code: 905, msg: ex.message}, 500);
    }
};


exports.check = function* (phone, passwd) {
    
}