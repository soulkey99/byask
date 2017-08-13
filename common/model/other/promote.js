/**
 * Created by MengLei on 2016-08-18.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let ShareCodeSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'promoter'},
    desc: {type: String, default: ''},
    shareCode: {type: String, required: true}
}, {timestamps: 1, read: 'sp'});

let PromoteSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    phone: {type: String, required: true},
    count: {type: Number, default: 1},
    new: {type: Boolean, default: false},
    ua: {type: String, default: ''},
    ip: {type: String, default: '', set: transIP},
    shareCode: {type: String, required: true},
    userID: {type: Schema.Types.ObjectId},
    regAt: {type: Date}
}, {timestamps: 1, read: 'sp'});

ShareCodeSchema.plugin(BaseModel);
PromoteSchema.plugin(BaseModel);

ShareCodeSchema.virtual('userID', function () {
    return !!this.userID ? this.userID.toString() : '';
});

ShareCodeSchema.method('toInfo', function () {
    return {
        type: this.type,
        userID: !!this.userID ? this.userID.toString() : '',
        desc: this.desc,
        link: (process.env.NODE_ENV == 'production' ? 'http://api.iwenda.me/download/index.html' : 'http://api.test.iwenda.me/download/index.html') + '?shareCode=' + this.shareCode,
        shareCode: this.shareCode,
        createdAt: this.createdAt
    }
});

PromoteSchema.method('toInfo', function () {
    let item = {
        promote_id: this._id.toString(),
        phone: this.phone,
        count: this.count,
        new: this.new,
        shareCode: this.shareCode,
        reg: false,
        userID: '',
        regAt: ''
    };
    if (this.userID && this.regAt) {
        item.reg = true;
        item['userID'] = this.userID.toString();
        item['regAt'] = this.regAt;
    }
    return item;
});

function transIP(str) {
    // ipv4校验正则： /^(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}/
    // ipv6校验正则： /^(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+/g
    if (!/^(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+/g.test(str)) {
        return str; //非ipv6，直接返回
    }
    return str.slice(str.lastIndexOf(':') + 1, str.length);
}

ShareCodeSchema.index({shareCode: 1});
PromoteSchema.index({phone: 1});
PromoteSchema.index({createdAt: -1});

mongoose.model('ShareCode', ShareCodeSchema, 'promoteShareCode');
mongoose.model('Promote', PromoteSchema, 'promote');

