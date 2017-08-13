/**
 * Created by MengLei on 2016-06-29.
 */
"use strict";

exports.auth = function *(next) {
    let u = this.request.body.username;
    let p = this.request.body.password;
    // console.log('auth');
    if (validator.isMongoId(u)) {
        let user = yield proxy.User.getUserById(u);
        if (user && user.authSign == p) {
            return result(this, 'OK');
        }
    }
};

exports.superuser = function *(next) {
    if (this.request.body.username == 'sktalent') {
        this.status = 200;
        this.body = 'OK';
    } else {
        this.status = 404;
        this.body = 'No';
    }
};

exports.acl = function *(next) {
    // console.log('acl');
    this.status = 200;
    this.body = 'OK';
};
