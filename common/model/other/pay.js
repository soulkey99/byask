/**
 * Created by MengLei on 2016-06-22.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let ChargeSchema = new Schema({
    id: {type: String},
    object: {type: String},
    created: {type: Number},
    livemode: {type: Boolean},
    paid: {type: Boolean},
    refunded: {type: Boolean},
    app: {type: String},
    channel: {type: String},
    order_no: {type: String},
    client_ip: {type: String},
    amount: {type: Number},
    amount_settle: {type: Number},
    currency: {type: String, default: 'cny'},
    subject: {type: String},
    body: {type: String},
    extra: {type: Object},
    time_paid: {type: Number},
    time_expire: {type: Number},
    time_settle: {type: Number},
    transaction_no: {type: String},
    refunds: [],
    amount_refunded: {type: Number},
    failure_code: {type: String},
    failure_msg: {type: String},
    metadata: {type: Object},
    credential: {type: Object},
    description: {type: String}
}, {_id: false});

let RefundSchema = new Schema({
    id: {type: String},
    object: {type: String},
    order_no: {type: String},
    amount: {type: Number},
    created: {type: Number},
    succeed: {type: Boolean},
    status: {type: String},
    time_succeed: {type: Number},
    description: {type: String},
    failure_code: {type: String, default: null},
    failure_msg: {type: String, default: null},
    metadata: {type: Schema.Types.Mixed},
    charge: {type: String},
    charge_order_no: {type: String},
    transaction_no: {type: String}
}, {_id: false});

let PaySchema = new Schema({
    _id: {type: Schema.Types.ObjectId},     //支付订单ID
    userID: {type: Schema.Types.ObjectId},      //用户ID
    expert_id: {type: Schema.Types.ObjectId},   //专家ID
    o_id: {type: Schema.Types.ObjectId},        //订单ID（如果是支付订单）
    note_id: {type: Schema.Types.ObjectId},      //纸条ID（如果是支付小纸条）
    type: {type: String, default: 'order'},     //支付类型（order：订单，note：支付小纸条，listen：偷听小纸条，withdraw：提现）
    channel: {type: String, default: 'alipay'}, //支付渠道
    amount: {type: Number, required: true},     //订单金额
    rebate: {type: Number},         //提现订单平台分成
    money: {type: Number},          //实际支付的金额
    currency: {type: String, default: 'cny'},   //支付币种
    subject: {type: String, default: ''},
    status: {type: String, default: 'pending'}, //pending：待支付，paid：支付成功，cancel：取消支付，timeout：超时，refunded：已退款
    refund_status: {type: String},  //退款状态，pending，success
    client_status: {type: String, default: 'pending'}, //pending：待支付，success：支付成功，cancel：取消支付，timeout：超时
    desc: {type: String, default: ''},
    charge: {type: ChargeSchema},
    refund: {type: RefundSchema}
}, {
    timestamps: 1,
    toObject: {
        transform(doc, ret){
            delete(ret.__v);
            delete(ret._id);
            delete(ret.id);
        }
    },
    read: 'pp'
});

let WebhookSchema = new Schema({
    // _id: {type: Schema.Types.ObjectId},     //webhook记录ID
    id: {type: String},
    created: {type: Number},
    livemode: {type: Boolean},
    type: {type: String},
    data: {
        object: {type: Schema.Types.Mixed}
    },
    object: {type: String},
    pending_webhooks: {type: Number},
    request: {type: String}
}, {timestamps: 1});

PaySchema.plugin(BaseModel);

PaySchema.virtual('pay_id').get(function () {
    return this._id.toString();
});
PaySchema.virtual('webhook_id').get(function () {
    return this._id.toString();
});

PaySchema.index({createdAt: -1});
PaySchema.index({'charge.id': 1});
WebhookSchema.index({'data.object.id': 1});

mongoose.model('Pay', PaySchema, 'pay');
mongoose.model('Webhook', WebhookSchema, 'webhook');

