/**
 * Created by MengLei on 2016-08-04.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('./../baseModel');

let ShareSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    target: {type: String, default: 'circle'},
    type: {type: String, default: 'user'},
    param: {type: Schema.Types.Mixed, default: {}}
}, {timestamps: 1, read: 'sp'});

ShareSchema.plugin(BaseModel);

ShareSchema.virtual('share_id').get(function () {
    return this._id.toString();
});

mongoose.model('Share', ShareSchema, 'share');
