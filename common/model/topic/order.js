/**
 * Created by MengLei on 2016-06-21.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let ChatSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    from: {type: Schema.Types.ObjectId, required: true},
    to: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, default: 'text'},  //聊天类型：text文字，phone电话，notice：通知
    duration: {type: Number},   //电话时长
    content: {type: String}    //文字内容
}, {
    timestamps: 1,
    toObject: {
        transform(doc, ret){
            delete(ret.id);
            delete(ret._id);
        }
    }
});

let OrderSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},  //提问者ID
    topic_id: {type: Schema.Types.ObjectId},    //话题ID
    expert_id: {type: Schema.Types.ObjectId},   //专家ID
    type: {type: String, default: 'phone'},     //订单类型，phone：通话
    price: {type: Number, default: 0},      //价格
    duration: {type: Number, default: 60},  //通话时长
    money_id: {type: Schema.Types.ObjectId},    //支付订单ID
    auto_finished: {type: Boolean, default: false},      //是否自动完成
    status: {type: String, default: 'pending'}, //订单状态，pending待确认，confirmed已确认待支付，paid已支付正在沟通，finished结束
    question: {type: String, default: ''},      //问题内容
    self_desc: {type: String, default: ''},   //自身介绍
    chat: {type: [ChatSchema], default: []},   //沟通内容
    comment: {type: String, default: ''},   //用户评价
    rating: {type: Number, default: 0},     //用户评星（0为未评价，取值1-5星）
    rejectReason: {type: String},      //专家拒绝原因
    cancelReason: {type: String},   //用户取消原因
    cancelAt: {type: Date},     //取消时间
    rejectAt: {type: Date},     //拒绝时间
    commentAt: {type: Date},    //评价时间
    confirmAt: {type: Date},    //专家确认时间
    payAt: {type: Date},    //用户支付时间
    finishAt: {type: Date}  //结束时间
}, {
    timestamps: 1,
    toObject: {
        transform(doc, ret){
            delete(ret.__v);
            delete(ret._id);
            delete(ret.id);
        }
    }
});

OrderSchema.plugin(BaseModel);

OrderSchema.virtual('o_id').get(function () {
    return this._id.toString();
});
ChatSchema.virtual('chat_id').get(function () {
    if (this._id) {
        return this._id.toString();
    } else {
        return "";
    }
});

OrderSchema.method('toOrder', function (userID) {
    let info = {
        o_id: this._id.toString(),
        userID: this.userID.toString(),
        expert_id: this.expert_id.toString(),
        topic_id: this.topic_id.toString(),
        question: this.question,
        self_desc: this.self_desc,
        price: this.price,
        status: this.status,
        chat: this.chat,
        comment: this.comment,
        rating: this.rating,
        category: this.category,
        expert_info: {},
        user_info: {},
        topic_info: {}
    };
    if (this.auto_finished) {
        info.auto_finished = true;
    }
    return function *() {
        if (info.expert_id) {
            let expert = yield mongoose.model('User').findById(info.expert_id);
            info.expert_info = yield expert.toExpert(userID);
        }
        if (info.userID) {
            info.user_info = (yield mongoose.model('User').findById(info.userID)).toUser();
        }
        if (info.topic_id) {
            info.topic_info = yield (yield mongoose.model('Topic').findById(info.topic_id)).toTopic();
        }
        return info;
    }
});

OrderSchema.index({createdAt: -1});

mongoose.model('Order', OrderSchema, 'order');
