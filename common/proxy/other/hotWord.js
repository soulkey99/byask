/**
 * Created by MengLei on 2016-07-11.
 */
"use strict";
const model = require('./../../model');

//记录词汇
exports.onSearch = function *(word) {
    yield model.HotWord.update({word: word}, {$inc: {count: 1}, $setOnInsert: {delete: false}}, {upsert: true});
};

//获取热搜列表
exports.getHotWords = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let words = yield model.HotWord.find({delete: false}).sort({count: -1}).skip(start).limit(count);
    let list = [];
    words.forEach(item=>list.push(item.word));
    return list;
};
