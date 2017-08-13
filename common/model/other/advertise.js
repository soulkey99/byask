/**
 * Created by MengLei on 2016-08-22.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('./../baseModel');
const Schema = mongoose.Schema;

//广告model
var ADSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    startAt: {type: Date, default: new Date('1970-01-01 08:00:00')},
    endAt: {type: Date, default: new Date('2199-12-31 23:59:59.999')},
    type: {type: String, default: 'homePop'},   //type=splash/banner/homePop/homeHide/
    platform: {type: [String], default: []},    //android/ios
    valid: {type: Boolean, default: false},
    remark: {type: String, default: ''},
    content: {
        type: {type: String, default: 'url'},  //type = url/user/topic/note
        dest: {type: String, default: ''},
        text: {type: String, default: ''},
        img: {type: String, default: ''}
    },
    seq: {type: Number, default: 99},
    resolution: {type: String, default: 'iphone5'}  //only for: splash
}, {timestamps: 1, read: 'sp'});

ADSchema.plugin(BaseModel);

ADSchema.virtual('ad_id').get(function () {
    return this._id.toString();
});

ADSchema.method('toContent', function () {
    return {
        type: this.content.type,
        dest: this.content.dest,
        text: this.content.text,
        img: this.content.img
    }
});

ADSchema.method('toInfo', function () {
    return {
        ad_id: this._id.toString(),
        startAt: this.startAt,
        endAt: this.endAt,
        type: this.type,
        platform: this.platform,
        valid: this.valid,
        remark: this.remark,
        content: this.toContent(),
        seq: this.seq,
        resolution: this.type == 'splash' ? this.resolution : '',
        createdAt: this.createdAt
    }
});

mongoose.model('Advertise', ADSchema, 'advertise');
