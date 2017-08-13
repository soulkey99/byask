/**
 * Created by MengLei on 2016-06-20.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let CategorySchema = new Schema({
    categoryName: {type: String},
    subCategory: {type: [String], default: []}
});

let ApplyInfoSchema = new Schema({
    title: {type: String, default: ''},     //专家头衔（职务）
    avatar: {type: String, default: ''},
    name: {type: String, default: ''},
    card: {type: String, default: ''},  //专家名片
    work_year: {type: String, default: ''},     //工作年限，显示一个string
    city: {type: String, default: ''},      //城市
    banner: {type: String, default: ''},        //个性照片
    major: {type: [String], default: []},   //专家tag
    category: {type: [CategorySchema], default: []},    //专家分类
    company: {type: String, default: ''},   //专家就职公司
    note_price: {type: Number, default: 1000},  //小纸条收费价格
    self_intro: {type: String, default: ''}    //专家自我介绍
}, {_id: false});

let ApplySchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    info: {type: ApplyInfoSchema},
    status: {type: String, default: 'pending'},
    rejectReason: {type: [String], default: []},
    checkAt: {type: Date}
}, {
    timestamps: 1,
    toObject: {
        transform(doc, ret) {
            delete(ret._id);
            delete(ret.id);
            delete(ret.__v);
        }
    }
});

ApplySchema.plugin(BaseModel);

ApplySchema.virtual('apply_id').get(function () {
    return this._id.toString();
});

mongoose.model('ExpertApply', ApplySchema, 'expertApply');
