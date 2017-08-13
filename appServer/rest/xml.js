/**
 * Created by MengLei on 2016-07-12.
 */
"use strict";
const Router = require('koa-router');
const call = require('./call');
const weixin = require('./weixin');

let router = new Router();

router.get('/wx', weixin.check_middle, weixin.wx_check);     //微信验证接口
router.post('/wx', weixin.check_middle, weixin.wx_webhook);  //微信消息回调

router.post('/ytxhook/:action', call.ytxwebhook);   //云通讯回调地址，需要xml解析，deprecated

module.exports = router;
