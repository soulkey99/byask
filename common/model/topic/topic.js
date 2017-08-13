/**
 * Created by MengLei on 2016-06-17.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let TopicSchema = new Schema({
    _id: {type: Schema.ObjectId},
    userID: {type: Schema.ObjectId},             //用户ID
    type: {type: String, required: true},       //话题类型，phone：通话
    category: {type: String, required: true},   //话题分类
    subCategory: {type: String, default: ''},  //话题子分类
    title: {type: String, required: true},      //话题题目
    summary: {type: String, default: ''},    //话题简介
    description: {type: String, required: true},//话题介绍
    price: {type: Number, default: 0},          //话题价格（单位：分）
    duration: {type: Number, default: 60},      //话题持续时长（单位：分钟）
    tags: {type: [String], default: []},        //话题标签
    will_count: {type: Number, default: 0},     //感兴趣数
    finished: {type: Number, default: 0},       //完成次数
    rating: {type: Number, default: 0},         //评分
    comment_count: {type: Number, default: 0},  //评论次数
    status: {type: String, default: 'verified'}, //审核状态，暂时默认审核通过(pending：审核中，verified：审核通过，fail：审核失败，closed：用户关闭)
    hotIndex: {type: Number, default: 0},       //热门指数
    delete: {type: Boolean, default: false}   //是否删除
}, {
    timestamps: 1,
    toObject: {
        transform(doc, ret){
            delete(ret._id);
            delete(ret.id);
        }
    }
});

TopicSchema.plugin(BaseModel);

//获取topic的basic info，用在各处
TopicSchema.method('toTopic', function () {
    let info = {
        topic_id: this._id.toString(),
        title: this.title,
        description: this.description,
        finished: this.finished,
        duration: this.duration,
        price: this.price,
        rating: this.rating,
        status: this.status,
        category: this.category,
        subCategory: this.subCategory,
        banner: ''
    };
    return function *() {
        if (info.category) {
            let cateInfo = yield require('../.').Category.findOne({categoryName: info.category});
            if (cateInfo) {
                info.banner = cateInfo.order_banner;
            }
        }
        return info;
    }
});

TopicSchema.virtual('topic_id').get(function () {
    return this._id.toString();
});

TopicSchema.index({userID: 1});

mongoose.model('Topic', TopicSchema, 'topic');
