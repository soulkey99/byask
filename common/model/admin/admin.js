/**
 * Created by MengLei on 2016-07-07.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('./../baseModel');
const Schema = mongoose.Schema;

let AdminSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userName: {type: String, required: true},
    passwd: {type: String, required: true},
    intro: {type: String, default: ''},
    remark: {type: String, default: ''},
    type: {type: String, default: 'admin'},
    delete: {type: Boolean, default: false},
    sections: {type: Schema.Types.Mixed, default: []},
    userInfo: {
        avatar: {type: String, default: ''},
        name: {type: String, default: ''},
        phone: {type: String, default: ''},
        address: {type: String, default: ''}
    },
    lastLogin: {type: Date}
}, {timestamps: 1, read: 'sp'});

AdminSchema.plugin(BaseModel);

AdminSchema.virtual('userID').get(function () {
    return this._id.toString();
});
AdminSchema.method('toInfo', function () {
    return {
        userID: this._id.toString(),
        userName: this.userName,
        intro: this.intro,
        type: this.type,
        remark: this.remark,
        sections: this.sections,
        userInfo: {
            avatar: this.userInfo.avatar,
            name: this.userInfo.name,
            phone: this.userInfo.phone,
            address: this.userInfo.address
        },
        lastLogin: this.lastLogin,
        createdAt: this.createdAt
    };
});
AdminSchema.index({userName: 1});

mongoose.model('Admin', AdminSchema, 'admin');


