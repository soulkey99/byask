/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let BannerSchema = new Schema({
    _id: {type: Schema.ObjectId},
    img: {type: String, required: true},       //图片地址
    type: {type: String, default: 'user'},  //banner类型，user：用户，url：跳转链接，待扩展
    dest: {type: String, default: '', required: true},      //跳转目标，如果type=user就是userID，如果type=url就是链接，待扩展
    remark: {type: String, default: ''},    //备注
    seq: {type: Number, default: 9},        //排序
    valid: {type: Boolean, default: false},//是否可用
    startAt: {type: Date}, //可用开始时间
    endAt: {type: Date}    //可用截止时间
}, {timestamps: 1, read: 'sp'});

BannerSchema.plugin(BaseModel);

BannerSchema.method('toItem', function () {
    return {
        banner_id: this.banner_id,
        img: this.img,
        type: this.type,
        dest: this.dest,
        remark: this.remark,
        seq: this.seq,
        valid: this.valid,
        startAt: this.startAt,
        endAt: this.endAt
    };
});

BannerSchema.virtual('banner_id').get(function () {
    return this._id.toString();
});

mongoose.model('HomeBanner', BannerSchema, 'homeBanner');
