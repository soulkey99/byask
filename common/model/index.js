/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";
const mongoose = require('mongoose');
const walkUtil = require('../../utils/walkdir');
const path = require('path');
const config = require('../../config');

let dbhost = process.env.NODE_ENV == 'production' ? config.db.production : process.env.NODE_ENV == 'test' ? config.db.test : config.db.development;
let dbpath = process.env.NODE_ENV == 'production' ? config.db.prod_path : process.env.NODE_ENV == 'test' ? config.db.test_path : config.db.dev_path;
let userpath = process.env.NODE_ENV == 'production' ? config.db.prod_user_path : process.env.NODE_ENV == 'test' ? config.db.test_user_path : config.db.dev_user_path;

mongoose.connect(dbhost + dbpath, err=> {
    if (err) {
        console.error(`connect to mongodb error: ${err.message}`);
        process.exit(1);
    }
});
mongoose.Promise = require('bluebird');

let userConn = mongoose.createConnection(dbhost + userpath);
exports.userConn = userConn;

//自动遍历路径下的所有model定义文件，并require它们
walkUtil(__dirname).forEach(item=> {
    if (path.extname(item) == '.js' && path.basename(item) != 'index.js' && path.basename(item) != 'baseModel.js') {
        require(item);
    }
});
//export两个数据库下的所有model
module.exports = Object.assign({}, mongoose.models, userConn.models);

