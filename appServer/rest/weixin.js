/**
 * Created by MengLei on 2016-08-10.
 */
"use strict";
const co = require('co');
const url = require('url');
const crypto = require('crypto');
const request = require('request');
const CronJob = require('cron').CronJob;
const API = require('co-wechat-api');
const baseUrl = 'https://api.weixin.qq.com/';
const config = require('../../config').wx_config;
const redis = require('./../../config').redis;

let api = new API(config.mp_app_id, config.mp_app_secret, function *() {
    let res = yield [
        redis.get('SKTalent:wx:mp_access_token'),
        redis.get('SKTalent:wx:mp_access_token_expire')
    ];
    return {accessToken: res[0], expireTime: new Date(res[1]).getTime()};
}, function *(token) {
    yield [redis.set('SKTalent:wx:mp_access_token', token.accessToken),
        redis.set('SKTalent:wx:mp_access_token_expire', new Date(token.expireTime).toJSON())
    ]
});
api.registerTicketHandle(function *() {
    let res = yield [
        redis.get('SKTalent:wx:mp_js_ticket'),
        redis.get('SKTalent:wx:mp_js_ticket_expire')
    ];
    return {ticket: res[0], expireTime: new Date(res[1]).getTime()};
}, function *(type, ticket) {
    yield [
        redis.set('SKTalent:wx:mp_js_ticket', ticket.ticket),
        redis.set('SKTalent:wx:mp_js_ticket_expire', new Date(ticket.expireTime).toJSON())
    ];
});

//js ticket
exports.wx_js_config = function *(next) {
    let res = yield api.getJsConfig({
        debug: process.env.NODE_ENV != 'production',
        url: this.request.query.url
    });
    return result(this, {
        code: 900,
        nonceStr: res.nonceStr,
        timestamp: res.timestamp,
        signature: res.signature,
        appId: res.appId,
        jsApiList: res.jsApiList
    });
};

//展现微信回调的query string
exports.wx_query = function *(next) {

};

//检查openid和access_token的有效性
exports.check = check;
function* check(openid, access_token) {
    //https://api.weixin.qq.com/sns/auth?access_token=_p5AZ_6lU8TJIot6MHBUDZfE2xtTJ9IT2yxWWZy2rplpARv5RXypyOfjvrr2bCZx8c6jsWTnLhZlCTzOvm7smpnx44_QolBEazbXk1h20TQ&openid=ojYONwG-LKiFFfBF49bWaKNNqBCc
    let res1 = yield req({
        url: `${baseUrl}sns/auth?access_token=${access_token}&openid=${openid}`,
        method: 'GET',
        json: true
    });
    let res = {valid: !res1.errcode, nick: '', avatar: '', unionid: '', errmsg: res1.errmsg};
    if (!res.valid) {
        return res;
    }
    let res2 = yield req({
        url: `${baseUrl}sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`,
        method: 'GET',
        json: true
    });
    res.nick = res2.nickname;
    res.avatar = res2.headimgurl;
    res.unionid = res2.unionid;
    return res;
}

//oauth接口，根据code换取openid和accessToken
exports.oauth = function *(next) {
    let body = this.request.query;
    let res = yield req({   //code 换取 openid和accessToken
        url: `${baseUrl}sns/oauth2/access_token?appid=${config.mp_app_id}&secret=${config.mp_app_secret}&code=${body.code}&grant_type=authorization_code`,
        method: 'GET',
        json: true
    });
    if (res.errcode) {
        return result(this, {code: 913, msg: '授权失败！', info: res}, 400);
    }
    let res2 = yield req({  //openid和accessToken换取userinfo
        url: `${baseUrl}sns/userinfo?access_token=${res.access_token}&openid=${res.openid}&lang=zh_CN`,
        method: 'GET',
        json: true
    });
    if (res2.errcode == 48001) {//对于accessToken和openid获取userinfo返回48001错误，一般都是scope=snsapi_base造成的，这里重定向到scope=snsapi_userinfo去让用户手动授权即可
        return result(this, {
            code: 914,
            url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.mp_app_id + "&redirect_uri=" + encodeURIComponent(uncode(this.header['referer'])) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
        });
    }
    if (res2.errcode) {
        return result(this, {code: 913, msg: '授权失败！', info: res}, 400);
    }

    this.request.body.ssoType = 'weixin';
    this.request.body.openid = res.openid;
    this.request.body.access_token = res.access_token;
    this.request.body.refresh_token = res.refresh_token;
    res.nick = res2.nickname;
    res.avatar = res2.headimgurl;
    res.unionid = res2.unionid;
    yield next;
};

//跳转授权，获取code，参数url=回调地址，scope=snsapi_base或者snsapi_userinfo
exports.wx_redirect = function *(next) {
    let url = this.request.query.url || (process.env.NODE_ENV == 'production' ? 'http://api.iwenda.me/test/index.html' : 'http://api.test.iwenda.me/test/index.html');
    let scope = this.request.query.scope || 'snsapi_base';
    this.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.mp_app_id + "&redirect_uri=" + encodeURIComponent(url) + "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect");
};

//检测是否可以静默登陆，如果可以，那么直接登陆，否则，跳转授权登陆
//通过code获取openid和accessToken，再根据openid和accessToken获取用户信息，如果能获取成功，就可以登陆，否则就是跳转授权登陆的方式进行注册
exports.oauth_base = function *(next) {
    result(this, {code: 900});
};

//验证微信服务器发过来的请求所带的signature是否合法，如果合法，则进行处理，如果不合法，直接返回错误
exports.check_middle = function *(next) {
    let body = this.request.query;
    if (body.signature == checkSignature(config.mp_token, body.timestamp, body.nonce)) {
        yield next;
    } else {
        return result(this, 'not_ok', 400);
    }
};

//对于微信服务器的验证请求，直接返回echostr
exports.wx_check = function *(next) {
    let body = this.request.query;
    return result(this, body.echostr);
};

//微信回调通知方法
exports.wx_webhook = function *(next) {
    let body = this.request.body.xml;
    let wxBody = parseMsg(body);
    proxy.Weixin.onMsg(wxBody);
    console.log(wxBody);
    let res = `<xml>
        <ToUserName><![CDATA[${wxBody.fromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${wxBody.toUserName}]]></FromUserName>
        <CreateTime>${(Date.now() / 1000).toFixed(0)}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[你好]]></Content>
        </xml>`;
    return result(this, res);
};

exports.upMedia = function *(path) {
    let res = yield api.uploadMedia('D:\\Workplace\\byask\\.dev\\切图\\banner\\banner4@3x.png', 'image');
    console.log(res);
};

// doRefresh();
function doRefresh() {
    co(refreshToken());
}
function* refreshToken(callback) {    //first fetch access token or refresh before expiration
    if (wx_global.cron != null) {
        wx_global.cron.stop();
    }
    let redis_res = yield [
        redis.get('SKTalent:wx:mp_access_token'),
        redis.get('SKTalent:wx:mp_access_token_expire'),
        redis.get('SKTalent:wx:mp_js_ticket'),
        redis.get('SKTalent:wx:mp_js_ticket_expire')
    ];
    if (!!redis_res[0] && (Date.now() - new Date(redis_res[1])) > 3600000 && !!redis_res[2] && (Date.now() - new Date(redis_res[3])) > 3600000) {
        return wx_global.cron = new CronJob(new Date(Date.now() + 3600000), doRefresh, null, true);
    }
    let res1 = yield req({
        url: `${baseUrl}cgi-bin/token?grant_type=client_credential&appid=${config.mp_app_id}&secret=${config.mp_app_secret}`,
        method: 'GET',
        json: true
    });
    if (!res1.errcode) {
        wx_global.access_token = res1.access_token;
        wx_global.access_token_expire = new Date(Date.now() + res1.expires_in * 1000);
        yield [
            redis.set('SKTalent:wx:mp_access_token', wx_global.access_token),
            redis.expire('SKTalent:wx:mp_access_token', res1.expires_in),
            redis.set('SKTalent:wx:mp_access_token_expire', wx_global.access_token_expire.toJSON()),
            redis.expire('SKTalent:wx:mp_access_token_expire', res1.expires_in)
        ]
    }
    let res2 = yield req({
        url: `${baseUrl}cgi-bin/ticket/getticket?access_token=${wx_global.access_token}&type=jsapi`,
        method: 'GET',
        json: true
    });
    if (!res2.errcode) {
        wx_global.js_ticket = res2.ticket;
        wx_global.js_ticket_expire = new Date(Date.now() + res2.expires_in * 1000);
        yield [
            redis.set('SKTalent:wx:mp_js_ticket', wx_global.js_ticket),
            redis.expire('SKTalent:wx:mp_js_ticket', res2.expires_in),
            redis.set('SKTalent:wx:mp_js_ticket_expire', wx_global.js_ticket_expire.toJSON()),
            redis.expire('SKTalent:wx:mp_js_ticket_expire', res2.expires_in)
        ]
    }
    wx_global.cron = new CronJob(new Date(Date.now() + 3600000), doRefresh, null, true);
}


function checkSignature(token, ts, nonce) {
    let arr = [token, ts, nonce];
    arr.sort();
    let sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(''));
    return sha1.digest('hex');
}

function req(opt, callback) {   //thunkify request
    return function (callback) {
        request(opt, (err, res, body)=> {
            callback(err, body);
        });
    }
}

//特殊功能，将url中querystring的code参数去掉，其他部分全都保留
function uncode(p) {
    let u = url.parse(p, true);
    delete(u.query.code);
    delete(u.search);
    return url.format(u);
}

//解析微信post消息的xml数据
function parseMsg(xml) {
    let wxBody = {};
    // let objProps = ['ToUserName', 'FromUserName', 'CreateTime', 'MsgType', 'Content', 'MsgId', 'PicUrl', 'MediaId', 'Format', 'Recognition', 'ThumbMediaId', 'Location_X', 'Location_Y', 'Scale', 'Label', 'Description', 'Url'];
    Object.keys(xml).forEach(i=> {
        if (xml[i]) {
            if (i == 'CreateTime') {
                xml[i][0] = new Date(parseInt(xml[i][0]) * 1000);
            }
            wxBody[i.substr(0, 1).toLowerCase() + i.substr(1, i.length - 1)] = xml[i][0];
        }
    });
    return wxBody;
}
