/**
 * Created by MengLei on 2016-06-16.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let CategorySchema = new Schema({
    _id: {type: Schema.ObjectId},
    categoryName: {type: String, required: true},   //分类名称
    subCategoryName: {type: String},//子分类名称
    desc: {type: String, default: ''},      //分类介绍
    keywords: {type: [String], default: []},//关键词
    img: {type: String, default: ''},       //图片
    order_banner: {type: String, default: ''},  //显示在进行中订单上的banner
    isHome: {type: Boolean, default: false},        //是否展示在首页
    seq: {type: Number, default: 9},
    type: {type: String, default: 'category'},
    finished: {type: Number, default: 0},       //一共完成单数（热门）
    recent: {type: Number, default: 0},          //近期完成单数（近期热门）
    valid: {type: Boolean, default: true}       //是否可用
}, {timestamps: 1, raed: 'sp'});

CategorySchema.plugin(BaseModel);

CategorySchema.method('toItem', function () {
    return {
        category_id: this.category_id,
        categoryName: this.categoryName,
        subCategoryName: this.subCategoryName,
        desc: this.desc,
        keywords: this.keywords,
        img: this.img,
        order_banner: this.order_banner,
        isHome: this.isHome,
        seq: this.seq,
        type: this.type,
        finished: this.finished,
        recent: this.recent,
        valid: this.valid
    }
});

CategorySchema.pre('save', function (next) {
    if (this.type == 'category') {
        this.isHome = true;
    }
    next();
});

CategorySchema.virtual('category_id').get(function () {
    return this._id.toString();
});

mongoose.model('Category', CategorySchema, 'category');
