/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let SessionSchema = new Schema({
    _id: {type: Schema.ObjectId},
    authSign: {type: String, default: ''},
    userID: {type: Schema.ObjectId},
    client: {type: String, default: ''},
    imei: {type: String, default: ''},
    info: {type: Object, default: {}},
    expire: {type: Date}
});

SessionSchema.plugin(BaseModel);
SessionSchema.pre('save', function (next) {
    this.expire = new Date();
    next();
});

SessionSchema.virtual('session_id').get(()=>{
    return this._id.toString();
});

SessionSchema.index({expire: 1}, {expireAfterSeconds: 86400});

mongoose.model('UserSession', SessionSchema, 'userSession');
