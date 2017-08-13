/**
 * Created by MengLei on 2016-06-22.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let MoneySchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    pay_id: {type: Schema.Types.ObjectId},
    o_id: {type: Schema.Types.ObjectId},
    note_id: {type: Schema.Types.ObjectId},
    desc: {type: String, default: ''},
    type: {type: String, required: true},
    amount: {type: Number, required: true}
}, {timestamps: 1, read: 'sp'});

let WithdrawSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},  //用户ID
    status: {type: String, default: 'pending'}, //提现状态
    amount: {type: Number, required: true}, //提现数额
    money: {type: Number},      //实际支付（扣除手续费）
    money_id: {type: Schema.Types.ObjectId},    //资金记录ID
    pay_id: {type: Schema.Types.ObjectId},  //支付订单号
    remark: {type: String, default: ''},    //原因
    checkAt: {type: Date}       //支付时间
}, {timestamps: 1, read: 'sp'});

MoneySchema.plugin(BaseModel);
WithdrawSchema.plugin(BaseModel);

MoneySchema.virtual('money_id').get(function () {
    return this._id.toString();
});

WithdrawSchema.virtual('withdraw_id').get(function () {
    return this._id.toString();
});

MoneySchema.method('toItem', function () {
    let item = {
        money_id: this.money_id,
        userID: this.userID.toString(),
        type: this.type,
        amount: this.amount,
        desc: this.desc,
        createdAt: this.createdAt
    };
    if (this.pay_id) {
        item.pay_id = this.pay_id.toString();
    }
    if (this.note_id) {
        item.note_id = this.note_id.toString();
    }
    if (this.o_id) {
        item.o_id = this.o_id.toString();
    }
    return item;
});

WithdrawSchema.method('toItem', function () {
    return {
        withdraw_id: this.withdraw_id,
        userID: this.userID.toString(),
        status: this.status,
        amount: this.amount,
        money: this.money,
        pay_id: this.pay_id || '',
        checkAt: this.checkAt || '',
        createdAt: this.createdAt || '',
        remark: this.remark || ''
    }
});

mongoose.model('Money', MoneySchema, 'money');
mongoose.model('Withdraw', WithdrawSchema, 'moneyWithdraw');
