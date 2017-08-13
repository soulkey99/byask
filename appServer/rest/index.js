/**
 * Created by MengLei on 2016-05-31.
 */
"use strict";
const Router = require('koa-router');
const auth = require('../utils/checkAuth');
const smsUtil = require('../../utils/sms');
const user = require('./user');
const home = require('./home');
const topic = require('./topic');
const order = require('./order');
const note = require('./note');
const pay = require('./pay');
const mqtt = require('./mqtt');
const call = require('./call');
const test = require('./test');
const other = require('./other');
const weixin = require('./weixin');

let router = new Router();

//用户相关
router.post('/smscode', smsUtil.get);   //获取短信验证码
router.post('/login', user.login);      //用户登录（短信登陆、密码登陆）
router.post('/ssoLogin', user.ssoLogin);//第三方登录
router.post('/autoLogin', user.autoLogin);  //自动登陆
router.post('/logout', user.logout);     //用户注销登陆
router.post('/register', smsUtil.middle, user.register);    //用户注册
router.post('/user/sso', auth.required, user.bindSSO);  //用户绑定、解绑sso信息
router.get('/user/sso', auth.required, user.getSSO);    //获取用户绑定、解绑sso信息
router.get('/user', auth.required, user.info);  //获取当前用户信息
router.put('/user', auth.required, user.modify);//修改用户信息
router.put('/user/passwd', auth.required, user.passwd); //修改密码
router.post('/user/resetPasswd', smsUtil.middle, user.resetPasswd); //重置密码
router.get('/user/:userID', auth.optional, user.info); //获取指定用户信息
router.get('/user/:userID/intro', auth.optional, user.intro);   //获取指定达人的个人自我介绍
// router.post('/user/:userID/follow', auth.required, user.follow);    //关注指定用户
router.post('/follow/:userID', auth.required, user.follow); //关注指定用户
router.get('/follows', auth.required, user.followList);     //获取关注用户列表
// router.get('/users', auth.optional, user.list);     //获取用户列表

//专家相关
router.post('/user/apply', auth.required, user.applyExpertInfo);   //提交申请达人
router.get('/user/apply', auth.required, user.pendingExpertInfo); //是否有审核中的申请
router.get('/user/stats', auth.required, user.expertStats);     //达人统计信息
router.get('/user/money', auth.required, user.getMoney);        //获取余额
router.get('/category/:categoryName/experts', auth.optional, user.getExpertList);    //获取指定分类下的达人列表
router.get('/category/:categoryName/subCategory/:subCategoryName/experts', auth.optional, user.getExpertList);    //获取指定分类下的达人列表

router.get('/user/expertInfo', auth.required, user.expertInfo);         //获取达人信息
router.get('/user/:userID/comments', auth.optional, user.comments);     //获取达人收到的评价列表

//首页相关
router.get('/home/category', auth.checkUser, home.category);    //首页分类数据
router.get('/home/banner', auth.checkUser, home.banner);        //首页banner列表
router.get('/home/recommend', auth.checkUser, home.recommend);  //首页推荐用户列表
router.get('/home/recommendNote', auth.checkUser, home.recommendNote);  //首页推荐纸条列表
router.get('/home/point', auth.required, home.redpoint);     //首页小红点信息
router.get('/home/advertise', auth.checkUser, home.advertise);     //获取广告信息
router.get('/search', auth.checkUser, home.search);    //搜索话题
router.get('/search/hotWords', auth.checkUser, other.hotWords); //热搜词汇
router.get('/home/discoverTopics', auth.optional, home.discoverTopics); //发现专区话题
router.get('/home/discoverNotes', auth.optional, home.discoverNotes);   //发现专区小纸条

//话题相关
router.get('/topic/category', topic.categories);    //获取话题可用分类列表（创建话题时使用）
router.get('/topic/category/:categoryName', topic.categories);//获取话题分类对应子分类列表（创建话题时使用）
router.post('/topic', auth.required, topic.create);    //创建话题
router.delete('/topic/:topic_id', auth.required, topic.delete); //删除话题
router.post('/topic/:topic_id/close', auth.required, topic.close);  //关闭话题
router.put('/topic/:topic_id', auth.required, topic.update);   //修改话题（未实现）
router.get('/user/:userID/topics', auth.optional, topic.getUserTopicList);  //获取指定用户的话题列表
router.get('/category/:categoryName/topics', topic.getList);    //获取指定分类下的话题
router.get('/topics', auth.required, topic.getUserTopicList);   //获取我的话题列表
router.get('/topic/:topic_id', topic.get);  //获取话题详情
router.get('/topic/:topic_id/comments', topic.comments);    //获取指定话题的评论列表

//订单相关
router.post('/topic/:topic_id/order', auth.required, order.create); //创建订单
router.get('/order/:o_id', auth.required, order.get);   //获取订单详情
router.post('/order/:o_id/cancel', auth.required, order.delete);  //取消订单
router.post('/order/:o_id/pay', auth.required, order.pay);  //支付订单
router.post('/order/:o_id/call', auth.required, order.call); //订单发起呼叫
router.post('/order/:o_id/finish', auth.required, order.finish);    //完成订单
router.get('/orders', auth.required, order.getList);    //获取订单列表
router.post('/order/:o_id/comment', auth.required, order.comment);  //评价订单

router.get('/order/unreadchat', auth.required, order.unreadchat);     //未读消息
router.get('/order/unreadnum', auth.required, order.unreadnum);   //未读消息数

router.get('/expert/orders', auth.required, order.expertGetList);   //达人获取订单列表
router.post('/order/:o_id/confirm', auth.required, order.confirm);  //达人确认订单

//小纸条相关
router.post('/user/:userID/note', auth.required, note.create);  //小纸条提问
router.get('/note/:note_id', auth.optional, note.get);   //获取小纸条详情
router.post('/note/:note_id/cancel', auth.required, note.cancel);   //取消小纸条订单
router.post('/note/:note_id/pay', auth.required, note.pay); //小纸条支付
router.get('/user/:userID/notes', auth.optional, note.getExpertAnsweredList);   //用户查看达人回答过的小纸条列表
router.get('/notes', auth.required, note.getList); //获取用户本人提出的小纸条列表
router.get('/listenNotes', auth.required, note.getListenList);  //获取用户偷听过的小纸条列表
router.get('/expertNotes', auth.required, note.expertList);  //达人获取本人接到过的小纸条列表
router.post('/note/:note_id/listen', auth.required, note.listen);   //用户支付偷听小纸条
router.get('/note/:note_id/reply', auth.required, note.getReply);    //用户获取偷听小纸条的语音URL
router.post('/note/:note_id/reply', auth.required, note.reply);     //达人回复小纸条


//支付相关
router.get('/pay/:pay_id', auth.required, pay.get); //根据pay_id获取支付信息
router.get('/pay/:pay_id/status', auth.required, pay.getStatus); //获取支付状态
router.post('/pay/:pay_id/status', auth.required, pay.setStatus);   //设置支付状态
router.get('/pay/checkInfo', auth.required, pay.checkSecure);   //检查是否设置过支付密码、密保问题
router.post('/pay/passwd', auth.required, pay.setPayPasswd);    //设置支付密码(需要短信验证码)
router.post('/pay/question', auth.required, pay.setSecureQuestion); //设置密保问题
router.post('/pay/withdrawInfo', auth.required, smsUtil.middle, pay.setWithdrawInfo);    //设置提现账户
router.get('/pay/withdrawInfo', auth.required, pay.getWithdrawInfo);    //获取提现账户
router.post('/pay/withdraw', auth.required, pay.withdraw);  //提现
router.post('/pay/webhook', pay.webhook);   //接收ping++ webhook

//通话相关
router.post('/call/:callSid', auth.required, call.checkCall);
router.post('/call/ytxhook', call.ytxhook); //容联云通讯回调地址
router.post('/call/yxhook', call.yxhook);   //网易云信回调地址

//其他
router.get('/onlineConfig', auth.checkUser, other.getOnlineConfig);     //获取在线参数
router.post('/pushToken', auth.required, other.pushToken);      //上报友盟token
router.get('/feedback', auth.required, other.getFeedback);      //获取反馈列表
router.post('/feedback', auth.required, other.createFeedback);  //添加用户反馈
router.get('/update', auth.checkUser, other.checkUpdate);   //检测更新
router.get('/download', other.download);    //下载最新版本
router.post('/share', auth.required, other.share);      //客户端分享
router.get('/share/:share_id', other.getShare);     //获取分享share_id对应的内容
router.post('/promote/:shareCode', other.promote);  //推广上报手机号


//mqtt身份认证
router.post('/mqtt/superuser', mqtt.superuser);
router.post('/mqtt/auth', mqtt.auth);
router.post('/mqtt/acl', mqtt.acl);

//微信web端需要接口
router.get('/wx_js_config', weixin.wx_js_config);
router.get('/wx_oauth', weixin.oauth, user.ssoLogin);   //微信授权
router.get('/wx_redirect', weixin.wx_redirect);    //微信授权重定向
router.get('/wx_oauth_base', weixin.oauth_base);

//测试用接口
router.get('/test/user/:userID/verify', test.verify);
router.post('/test/umeng', test.umeng);
router.post('/test/kill', auth.required, test.kill);
router.post('/test/post', test.post);


module.exports = router;

