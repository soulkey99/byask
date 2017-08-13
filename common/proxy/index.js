/**
 * Created by MengLei on 2016-05-30.
 */
"use strict";

module.exports = {
    Admin: require('./admin/admin'),
    Advertise: require('./other/advertise'),
    Config: require('./config'),
    User: require('./user/user'),
    MqttUser: require('./user/mqtt'),
    ExpertApply: require('./user/apply'),
    UserSession: require('./user/userSession'),
    Feedback: require('./other/feedback'),
    Category: require('./home/category'),
    HomeBanner: require('./home/banner'),
    HomeRecommend: require('./home/recommend'),
    OnlineConfig: require('./other/onlineConfig'),
    SysConfig: require('./other/config'),
    Topic: require('./topic/topic'),
    HotWord: require('./other/hotWord'),
    Note: require('./topic/note'),
    Order: require('./topic/order'),
    OrderCall: require('./topic/call'),
    MqttMsg: require('./other/mqttMsg'),
    Money: require('./other/money'),
    Update: require('./other/update'),
    Pay: require('./other/pay'),
    Share: require('./other/share'),
    Promote: require('./other/promote'),
    Log: require('./other/log'),
    Weixin: require('./other/weixin')
};

