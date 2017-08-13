/**
 * Created by MengLei on 2016-06-15.
 */
"use strict";
const isWebp = require('is-webp');
const readChunk = require('read-chunk');
const webpconv = require('webpconv');
const thunkify = require('thunkify');
const result = require('../utils/result');
let conv = thunkify(webpconv.dwebp);

module.exports = function *(next) {
    let tmpPath = this.request.body.files.upload.path;
    let buffer = new Buffer(12);
    try {
        buffer = readChunk.sync(tmpPath, 0, 12);
        if (isWebp(buffer)) {
            yield conv(tmpPath, tmpPath);
            yield next;
        } else {
            yield next;
        }
    } catch (ex) {
        return result(this, {code: 905, msg: ex.message}, 500);
    }
};

