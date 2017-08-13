/**
 * Created by MengLei on 2016-06-13.
 */
"use strict";
const app = require('koa')();
const path = require('path');
const http = require('http');
const https = require('https');
const router = require('koa-router')();
const config = require('./../config');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const webp = require('./webp');
const upload = require('./upload');
const del = require('./del');

const kstatic = require('koa-static');

app.use(kstatic(path.join(__dirname, './../public'))); //static path
app.use(router.routes());

router.post('/del', bodyParser(), del);
router.post('/upload', koaBody({multipart: true}), webp, upload);

//测试页面
router.get('/test', function *() {
    // show a file upload form
    this.status = 200;
    this.set('content-type', 'text/html;charset=UTF-8');
    this.body =
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="thumbnail" placeholder="generate thumbnail or not"><br>' +
        '<input type="text" name="path" placeholder="specify upload path"><br>' +
        '<input type="text" name="vendor" placeholder="specify vendor"><br>' +
        '<input type="text" name="overwrite" placeholder="overwrite"><br>' +
        '<input type="text" name="userID" placeholder="specify userID"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>';
});

http.createServer(app.callback()).listen(config.port.file, err=> {
    if (err) {
        return console.log(`file server init error: ${err.message}`);
    }
    console.log(`file server listening at port: ${config.port.file}`);
});
https.createServer(config.ssl_opt, app.callback()).listen(config.port.file + config.port.ssl_inc, err=> {
    if (err) {
        return console.log(`file server init error: ${err.message}`);
    }
    console.log(`file server listening at port: ${config.port.file + config.port.ssl_inc}`);
});

//import some global method
global.result = require('./../utils/result');
global.logger = require('./../utils/log').file;

