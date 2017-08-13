/**
 * Created by MengLei on 2016-08-04.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('./../baseModel');

let ConfigSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    type: {type: String, required: true},
    valid: {type: Boolean, default: true},
    param: {type: Schema.Types.Mixed, default: {}},
}, {timestamps: 1, read: 'sp'});

ConfigSchema.plugin(BaseModel);

ConfigSchema.virtual('config_id').get(function () {
    return this._id.toString();
});

ConfigSchema.index({createdAt: -1});

mongoose.model('SysConfig', ConfigSchema, 'sysConfig');
