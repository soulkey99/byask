/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";
const app = require('koa')();
const http = require('http');
const path = require('path');
const https = require('https');
const qs = require('querystring');
// const views = require('koa-views');
const proxy = require('../common/proxy');
const config = require('./../config');
const router = require('koa-router')();
const rest = require('./rest');
const xml = require('./rest/xml');

// Must be used before any router is used
// app.use(views(path.join(__dirname, '/views'), {map: {ejs: 'ejs'}}));

app.use(function*(next) {   //http logger
    if (this.path.indexOf('/rest') == 0) {  //for rest api
        try {
            yield next;
        } catch (ex) {//global catch internal server error
            logger.trace(`method: ${this.method}, status: ${this.status}, code: 905, msg: ${ex.message}, path: ${this.path}, query: ${qs.stringify(this.query)}, body: ${JSON.stringify(this.request.body)}`);
            return result(this, {code: 905, msg: `服务器内部错误，${ex.message}`}, 500);
        }
        if (!this.body) {
            this.status = 404;
            this.body = {code: 911, msg: '请求的资源不存在！'};
        }
        //file logger
        logger.trace(`method: ${this.method}, status: ${this.status}, code: ${this.body.code}, path: ${this.path}, has_auth: ${!!this.header.auth}, query: ${JSON.stringify(this.query)}, body: ${JSON.stringify(this.request.body)}`);
        //db logger
        if (!!process.env.NODE_ENV) {
            proxy.Log.httpLog({
                userID: this.state.userID,
                reqIP: this.header['x-real-ip'] || this.ip,
                reqHeader: this.header,
                method: this.method,
                reqPath: this.path,
                reqParams: this.params,
                reqQuery: this.query,
                reqBody: this.request.body,
                resHeader: this.response.header,
                resStatus: this.status,
                resBody: this.body
            });
        }
    } else {    //for static files
        yield next;
        logger.trace(`status: ${this.status}, request: ${this.path}?${qs.stringify(this.query)}`);
    }
});
app.use(function *(next) {
    //为了兼容某些不标准的content-type，将最末尾的分号去除掉
    if (this.header['content-type']) {
        if (this.header['content-type'].lastIndexOf(';') == this.header['content-type'].length - 1) {
            this.header['content-type'] = this.header['content-type'].substr(0, this.header['content-type'].length - 1);
        }
    }
    yield next;
});

// app.use(require('koa-logger')());   //console logger
// app.use((require('koa-xml-body').default)());
app.use(require('koa-static')(path.join(__dirname, 'public'))); //static path

router.use('/rest',  //main route: body parser, rest router
    function *(next) {  //cors options for rest apis
        this.set('Access-Control-Allow-Origin', '*');
        yield next;
    },
    require('koa-body')(),
    rest.routes()
);

router.use('/xml', (require('koa-xml-body').default)(), xml.routes());  //xml webhook route

app.use(router.routes()/*, router.allowedMethods()*/);
app.use(xml.routes());

http.createServer(app.callback()).listen(config.port.app, err=> {
    if (err) {
        return console.log(`http server init error: ${err.message}`);
    }
    logger.fatal(`http server listening at port: ${config.port.app}`);
    console.log(`http server listening at port: ${config.port.app}`);
});
https.createServer(config.ssl_opt, app.callback()).listen(config.port.app + config.port.ssl_inc, err=> {
    if (err) {
        return console.log(`https server init error: ${err.message}`);
    }
    logger.fatal(`https server listening at port: ${config.port.app + config.port.ssl_inc}`);
    console.log(`https server listening at port: ${config.port.app + config.port.ssl_inc}`);
});

//graceful exit with closing db connection
process.on('SIGINT', ()=> {
    require('mongoose').disconnect();
    logger.fatal('server exit.');
    console.log('[FATAL] server exit.');
    process.exit(1);
});

//on start, some task
require('./rest/util/onStart');
//import some global method
global.validator = require('validator');    //字符校验
global.proxy = require('./../common/proxy/index');
global.result = require('./../utils/result');
global.logger = require('./../utils/log').http;
global.mqttSend = require('./utils/mqttClient').sendTo;
