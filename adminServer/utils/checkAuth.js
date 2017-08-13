/**
 * Created by MengLei on 2016-06-01.
 */
"use strict";
//校验登陆状态，header中放置一个auth字符串，格式为userID=xxx&session_id=xxx，并对其进行base64编码
exports.required = function *(next) {
    if(!this.session.user){
        this.redirect('/login.html');
    }
};

//可选校验登陆状态，如果客户端传了则必须校验通过，如果没传则直接next
exports.optional = function *(next) {
    let auth = this.header.auth;
    if (!auth) {
        yield next;
        return;
    }
    let q = qs.parse(new Buffer(auth, 'base64').toString('utf8'));
    if (!q.userID || !q.authSign || !validator.isMongoId(q.userID)) {
        return result(this, {code: 903, msg: '用户登录信息无效，请重新登陆！'}, 401);
    }
    try {
        let user = yield model.User.findById(q.userID);
        if (!user) {
            return result(this, {code: 902, msg: '用户不存在！'}, 404);
        }
        this.state.userID = q.userID;
        this.state.user = user.toObject({getters: true});
        yield next;
    } catch (ex) {
        return result(this, {code: 905, msg: ex.message}, 500);
    }
};