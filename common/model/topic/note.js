/**
 * Created by MengLei on 2016-06-24.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let NoteSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},     //纸条ID
    userID: {type: Schema.Types.ObjectId},      //用户ID
    expert_id: {type: Schema.Types.ObjectId},       //专家ID
    price: {type: Number, default: 0},      //小纸条价格
    anonymous: {type: Boolean, default: false}, //是否匿名纸条
    status: {type: String, default: 'pending'},     //小纸条状态（pending：支付中，cancel：取消，paid：支付完成，replied：回答完成，timeout：超时）
    content: {type: String, required: true},    //提问内容（文字）
    reply: {type: String, default: ''},     //专家回复内容（语音）
    length: {type: Number, default: 0},   //回复语音时长（单位：秒）
    list: {type: [Schema.Types.ObjectId], default: []},     //偷听过的用户ID列表
    ups: {type: [Schema.Types.ObjectId], default: []},   //点赞过的用户ID列表
    payAt: {type: Date},    //支付时间
    cancelAt: {type: Date},     //取消时间
    replyAt: {type: Date},      //回复时间
    delete: {type: Boolean, default: false}
}, {
    timestamps: 1,
    toObject: {
        transform(doc, ret){
            delete(ret.__v);
            delete(ret._id);
            delete(ret.id);
            delete(ret.list);
            delete(ret.ups);
        }
    }
});

let ListenHistrySchema = new Schema({
    note_id: {type: Schema.Types.ObjectId, required: true},
    t: {type: Date, required: true}
}, {_id: false});
let UserListenNoteSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    list: {type: [ListenHistrySchema], default: []}
}, {timestamps: 1});


NoteSchema.plugin(BaseModel);

NoteSchema.virtual('note_id').get(function () {
    return this._id.toString();
});

NoteSchema.index({userID: 1});
NoteSchema.index({expert_id: 1});
NoteSchema.index({createdAt: -1});

mongoose.model('Note', NoteSchema, 'note');
mongoose.model('NoteListen', UserListenNoteSchema, 'noteListen');
