/**
 * Created by MengLei on 2016-07-11.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('../baseModel');

let HotSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    word: {type: String, required: true},
    count: {type: Number, default: 1},
    delete: {type: Boolean, default: false}
}, {timestamps: 1, read: 'sp'});

HotSchema.index({word: 1});
HotSchema.index({word: 1, count: -1});
mongoose.model('HotWord', HotSchema, 'hotWords');
