/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let RecommendSchema = new Schema({
    _id: {type: Schema.ObjectId},
    category: {type: String, default: 'hot'},   //分类，hot，首页推荐热门列表，hotNote：首页推荐纸条区域
    type: {type: String, default: 'user'},  //类型，user：用户，note：小纸条，url：跳转链接，待扩展
    dest: {type: String, default: ''},      //跳转目标，如果type=user就是userID，如果type=note，就是小纸条ID，如果type=url就是链接，待扩展
    remark: {type: String, default: ''},    //备注
    seq: {type: Number, default: 9},        //排序
    special: {type: Boolean, default: true},//是否手动加入（待拓展）
    ad: {type: Boolean, default: false},    //是否推广信息（待拓展）
    valid: {type: Boolean, default: false},//是否可用
    startAt: {type: Date}, //可用时间（只针对推广以及手动加入的记录）
    endAt: {type: Date}    //可用时间
}, {timestamps: 1, read: 'sp'});

RecommendSchema.plugin(BaseModel);

RecommendSchema.method('toItem', function () {
    return {
        recommend_id: this.recommend_id,
        category: this.category,
        type: this.type,
        dest: this.dest,
        remark: this.remark,
        seq: this.seq,
        special: this.special,
        ad: this.ad,
        valid: this.valid,
        startAt: this.startAt || '',
        endAt: this.endAt || ''
    };
});

RecommendSchema.pre('save', function (next) {
    if (this.category == 'hotNote') {
        this.type = 'note';
    }
    next();
});

RecommendSchema.virtual('recommend_id').get(function () {
    return this._id.toString();
});

mongoose.model('HomeRecommend', RecommendSchema, 'homeRecommend');
