/**
 * Created by MengLei on 2016-06-20.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let HttpLogSchema = new Schema({
    // _id: {Type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    reqIP: {type: String, default: '', set: transIP},
    reqHeader: {type: Schema.Types.Mixed},
    method: {type: String, default: 'GET'},
    reqPath: {type: Schema.Types.Mixed},
    reqParams: {type: Schema.Types.Mixed},
    reqQuery: {type: Schema.Types.Mixed},
    reqBody: {type: Schema.Types.Mixed},
    resHeader: {type: Schema.Types.Mixed},
    resStatus: {type: Number, default: 200},
    resBody: {type: Schema.Types.Mixed}
}, {timestamps: 1, read: 'sp'});
let UserLogSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    action: {type: String, required: true},
    content: {type: Schema.Types.Mixed, default: {}}
}, {timestamps: 1, read: 'sp'});

function transIP(str) {
    // ipv4校验正则： /^(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}/
    // ipv6校验正则： /^(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+/g
    if (!/^(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+/g.test(str)) {
        return str; //非ipv6，直接返回
    }
    return str.slice(str.lastIndexOf(':') + 1, str.length);
}

UserLogSchema.method('toInfo', function () {
    return {
        log_id: this.log_id,
        userID: this.userID,
        action: this.action,
        content: this.content,
        createdAt: this.createdAt
    }
});

HttpLogSchema.plugin(BaseModel);
UserLogSchema.plugin(BaseModel);

HttpLogSchema.virtual('log_id').get(function () {
    return this._id.toString();
});
UserLogSchema.virtual('log_id').get(function () {
    return this._id.toString();
});
HttpLogSchema.index({userID: 1});
UserLogSchema.index({userID: 1});
HttpLogSchema.index({createdAt: -1});
UserLogSchema.index({createdAt: -1});
mongoose.model('HttpLog', HttpLogSchema, 'httpLog');
mongoose.model('UserLog', UserLogSchema, 'userLog');

