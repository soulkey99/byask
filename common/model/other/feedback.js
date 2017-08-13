/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('./../baseModel');
const Schema = mongoose.Schema;

let FeebackSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'text'},
    content: {type: String, required: true},
    direction: {type: String, default: 'u2a'},  //反馈信息的流向，u2a：用户向管理员，a2u：管理员向用户
    platform: {type: String},
    read: {type: Boolean, default: false}    //管理员是否已读
}, {timestamps: 1, read: 'sp'});

FeebackSchema.plugin(BaseModel);

FeebackSchema.virtual('feedback_id').get(function () {
    return this._id.toString();
});

FeebackSchema.method('toFeedback', function () {
    let info = {
        feedback_id: this._id.toString(),
        type: this.type,
        content: this.content,
        direction: this.direction,
        createdAt: this.createdAt,
        read: this.read
    };
    if (this.userID) {
        info.userID = this.userID.toString();
    }
    return info;
});

mongoose.model('Feedback', FeebackSchema, 'feedback');
