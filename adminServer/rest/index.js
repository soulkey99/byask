/**
 * Created by MengLei on 2016-07-07.
 */
"use strict";
const Router = require('koa-router');
const admin = require('./admin');
const expert = require('./expert');
const user = require('./user');
const other = require('./other');
const topic = require('./topic');
const home = require('./home');

let router = new Router();

//管理员用户部分
router.post('/login', admin.login);
router.put('/user/passwd', admin.passwd);
router.post('/logout', admin.logout);
router.post('/admin/', admin.createAdmin);   //创建管理员
router.post('/admin/:userID', admin.editAdmin);  //修改管理员
router.get('/admin/list', admin.getAdminList);   //获取管理员列表

//app用户部分
router.get('/user/:userID', user.getInfo);  //获取指定用户的信息
router.post('/user/:userID', user.update);  //编辑指定用户的信息
router.get('/users', user.search);  //根据相关信息搜索用户
router.post('/user', user.create);  //创建新用户
router.get('/user/withdraw', user.getWithdrawList); //获取用户提现列表
router.post('/user/withdraw/:withdraw_id', user.setWithdraw);   //设置用户提现成功
router.get('/user/money', user.getMoneyList);       //获取用户资金变动列表
router.get('/user/:userID/money', user.getMoneyList);   //获取指定用户资金变动列表
router.get('/user/logs', user.getUserLog);          //按条件获取用户log
router.get('/user/:userID/logs', user.getUserLog);      //获取指定用户的log
router.get('/user/blacklist', user.getBlackList);   //获取黑名单列表
router.post('/user/black', user.addBlack);      //加入黑名单
router.post('/user/:userID/black', user.addBlack);  //指定用户加入黑名单

//话题、订单、小纸条
router.get('/topic/category', topic.getCategory);    //获取话题可用分类列表（创建话题时使用）
router.get('/topic/category/:categoryName', topic.getCategory); //获取话题可用分类列表（创建话题时使用）
router.get('/user/:userID/topics', topic.getList);  //获取指定用户的话题列表
router.post('/user/:userID/topic', topic.create);   //为指定用户添加话题
router.post('/topic/:topic_id', topic.edit);        //编辑指定话题
router.get('/orders', topic.getOrderList); //获取(指定用户的)订单列表
router.get('/order/:o_id', topic.getOrderDetail);   //获取订单详情
router.get('/notes', topic.getNoteList);    //获取(指定用户的)小纸条列表
router.get('/note/:note_id', topic.getNoteDetail);  //获取小纸条详情


//专家资格
router.get('/expert/apply', expert.getApplyList);
router.post('/expert/check', expert.checkExpert);

//首页管理
router.get('/banner', home.getBannerList); //管理员获取banner列表
router.post('/banner', home.editBanner);        //新增banner
router.post('/banner/:banner_id', home.editBanner); //编辑banner
router.get('/recommends', home.getRecommendList);   //管理员获取推荐列表
router.post('/recommend', home.editRecommend);      //新增recommend
router.post('/recommend/:recommend_id', home.editRecommend);    //编辑recommend
router.get('/category', home.getCategoryList);  //管理员获取分类lxb
router.get('/category/:categoryName', home.getCategoryList);    //管理员获取分类列表
router.post('/category', home.editCategory);    //管理员新增分类
router.post('/category/:category_id', home.editCategory);   //管理员编辑分类
router.get('/home/advertise', home.getAdList);  //管理员获取广告列表
router.get('/home/advertise/preview', home.previewAd);  //管理员预览广告
router.post('/home/advertise', home.editAd);        //管理员添加广告
router.post('/home/advertise/:ad_id', home.editAd); //管理编辑广告

//其他接口
router.get('/feedback', other.feedback);    //用户反馈主列表
router.get('/feedback/:userID', other.userFeedback);    //指定用户反馈列表
router.post('/feedback', other.replyFeedback);  //回复用户反馈
router.get('/onlineConfig', other.getConfigs);  //获取在线参数列表
router.post('/onlineConfig/', other.editConfig);  //添加、修改在线参数
router.post('/onlineConfig/:config_id', other.editConfig);  //添加、修改在线参数
router.get('/update', other.getUpdate); //获取更新列表
router.post('/update', other.addUpdate);    //添加更新
router.post('/update/:update_id', other.addUpdate); //编辑更新
router.post('/shareCode', other.genShareCode);  //生成一个推广码
router.post('/shareCode/:shareCode', other.editShareCode);  //编辑推广码
router.get('/shareCode', other.getCodeList);        //获取推广码列表
router.get('/shareCode/:shareCode/stat', other.getCodeStat);    //获取指定推广码的推广效果
router.get('/shareCode/:shareCode/list', other.getCodePromoteList); //获取推广得到的手机号列表

//微信接口
router.post('/wx/');

//test
router.get('/user', function *(next) {
    this.body = this.session.user;
});

module.exports = router;
