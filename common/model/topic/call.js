/**
 * Created by MengLei on 2016-07-05.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let LegSchema = new Schema({
    endpoint: {type: String},
    endTime: {type: Date, set: str2Date},
    hangCause: {type: String}
}, {_id: false});

let CallSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, default: 'order'},
    vendor: {type: String, default: 'netease'},
    o_id: {type: Schema.Types.ObjectId},
    session: {type: String},
    caller: {type: String},
    callee: {type: String},
    createtime: {type: Date, set: str2Date},
    starttime: {type: Date, set: str2Date},
    callerType: {type: String},
    duration: {type: Number},
    initAccount: {type: String},
    status: {type: String, default: 'pending'},
    recordUrl: {type: String},
    legs: {type: [LegSchema], default: []}
}, {
    timestamps: 1
});

function str2Date(str) {
    return new Date(str);
}

CallSchema.plugin(BaseModel);

CallSchema.virtual('call_id').get(function () {
    return this._id.toString();
});

mongoose.model('OrderCall', CallSchema, 'orderCall');

