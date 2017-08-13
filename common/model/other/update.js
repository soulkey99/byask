/**
 * Created by MengLei on 2016-07-28.
 */
"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let UpdateSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    platform: {type: String, default: 'android'},
    channel: {type: String, default: 'default'},
    code: {type: Number, default: 0},
    version: {type: String, required: true},
    url: {type: String, required: true},
    desc: {type: String, default: ''},
    time: {type: String, default: ''},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp'});

UpdateSchema.plugin(BaseModel);

UpdateSchema.method('toInfo', function () {
    return {
        update_id: this._id.toString(),
        platform: this.platform,
        code: this.code,
        version: this.version,
        url: this.url,
        desc: this.desc,
        time: this.time
    }
});

UpdateSchema.virtual('update_id').get(function () {
    return this._id.toString();
});

UpdateSchema.index({code: -1});
UpdateSchema.index({createdAt: -1});

mongoose.model('Update', UpdateSchema, 'update');


