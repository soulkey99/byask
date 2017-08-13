/**
 * Created by MengLei on 2016-07-08.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let ConfigSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    key: {type: String, required: true},
    value: {type: String, required: true},
    platform: {type: String, default: 'android'},
    desc: {type: String, default: ''},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp'});

ConfigSchema.plugin(BaseModel);

ConfigSchema.method('toConfig', function () {
    return {
        config_id: this._id.toString(),
        key: this.key,
        value: this.value,
        platform: this.platform,
        desc: this.desc,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        valid: this.valid
    };
});

ConfigSchema.virtual('config_id').get(function () {
    return this._id.toString();
});

ConfigSchema.index({key: 1});

mongoose.model('OnlineConfig', ConfigSchema, 'onlineConfig');
