/**
 * Created by MengLei on 2016-06-16.
 */
"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ConfigSchema = new Schema({
    _id: {type: String, required: true},
    config: {type: Object, default: null}
}, {_id: false, timestamps: 1});

mongoose.model('Config', ConfigSchema, 'config');
