# 1、HTTP接口格式定义
## 1.1、采用HTTP restful接口请求，请求方式分为get、post、put、delete等，一般情况下，get请求参数放在querystring中进行传递，post请求参数以json形式放在http body中进行传递。
## 1.2、HTTP header需要传递以下参数
 - content-type: application/json
 - client: 1.0.2.3
 - platform: android
 - u: xxxxxxx
 - channel: TencentAPP
 - auth: xxxxx

其中client传递当前版本号，platform传递平台类型（ios、android），u传递客户端IMEI串，channel传递渠道号（仅android），auth传递用户登录信息，其计算方式如下：
```
// assume userID = "aaa", authSign = "bbb"
var str = "userID=aaa&authSign=bbb";
var auth = new Buffer(str, 'utf8').toString('base64'); //dXNlcklEPWFhYSZhdXRoU2lnbj1iYmI=
```
在访问接口的时候，对auth参数有三种要求：
 - no： 不需要传递auth参数，或者即使传递了服务端也不对其做任何解析或处理
 - required： 必须传递auth参数，并且服务端对其校验通过才可以访问接口
 - optional： 可选传递auth参数，如果传了，则必须校验通过方可访问接口，如果没传，可以直接访问接口

## 1.3、HTTP请求url
 http://[服务器地址]：[端口]/rest/xxxx 

# 2、域名、ip地址、端口：
 - 测试环境：
 - 正式环境：
 - 端口：所有rest api 的 http请求端口8071，https请求端口9071，文件上传的http请求端口8072，https请求端口9072，mqtt连接的端口为8075。


以下新域名。

|类型|正式环境|测试环境|备注|对应原端口|
|----|----|----|----|----|
|rest api|api.iwenda.me|api.test.iwenda.me|http/https|8071/9071|
|文件上传|file.iwenda.me|file.test.iwenda.me|http/https|8072/9072|
|管理中心|admin.iwenda.me|admin.test.iwenda.me|强制跳转https|8070/9070|
|mqtt连接|mqtt.iwenda.me|mqtt.test.iwenda.me|-|8075|

# 3、几个公共model定义

 - expert_info

```
{
    "name": "string",   //真实姓名
    "userID": "string", //用户ID
    "avatar": "string", //用户头像
    "title": "string",  //用户职位
    "major": [          //用户专长，数组
        "string"
    ],
    "finished": "int",          //完成订单数
    "note_replied": 12,         //回答小纸条数
    "note_listened": 20,        //小纸条被偷听次数
    "note_price": 1000,         //专家小纸条定价（单位：分）
    "confirm_time": "int",      //平均回应时间（分钟）
    "confirm_rate": "double",   //回复率
    "rating": "double",         //评价
    "is_follow": "bool",        //是否关注
    "category": [               //用户分类，数组，暂时没有用到
        {
            "categoryName": "创业辅导",
            "subCategory": ["创业案例", "商业计划"]
        }
    ]
}
```

 - user_info

```
 {
     "nick": "string",      //用户昵称
     "userID": "string",    //用户ID
     "avatar": "string"     //用户头像
 }
```

 - topic_info

```
 {
     "topic_id": "string",      //话题ID
     "title": "string",         //话题标题
     "discription": "string",   //话题描述
     "duration": 60,            //订单持续时长（单位：分钟）
     "finished": "int",         //话题完成订单数
     "price": "int",            //话题价格
     "rating": "double",        //话题评价
     "status": "string",        //话题状态
     "category": "string",      //话题分类
     "banner": "string"         //话题banner图片
 }
``` 

 - order_info

```
 {
     "o_id": "string",          //订单ID
     "question": "string",      //问题内容
     "self_desc": "string",     //用户自身情况描述
     "price": "int",            //订单价格
     "status": "string",        //订单状态
     "chat": [],                //对话内容
     "comment": "string",       //订单评价内容
     "rating": "double",        //订单评价星级
     "category": "string",      //订单分类
     "expert_info": {},         //专家info
     "user_info": {},           //用户info
     "topic_info": {}           //话题info
 }
```


# 4、错误码
 - 900： 请求成功
 - 901： 用户已经存在
 - 902： 用户不存在
 - 903： 用户登录信息失效或者没有登陆信息，请重新登陆
 - 904： 参数缺失或者格式错误
 - 905： 服务器内部错误
 - 906： 密码错误
 - 907： 用户尚未设置登录密码，请使用短信登陆
 - 908： 用户没有绑定手机号码
 - 909： 用户被封禁
 - 910： 用户没有操作权限（比如操作不是自己的订单或者当前状态不允许这样操作等）
 - 911： 要获取的资源不存在
 - 912： 发起电话呼叫失败
 - 913： 调用第三方服务失败
 - 914： 需要跳转，同时会返回跳转的url。
 

 ----以下code继承自leancloud服务-----
 - 601： 短信验证码发送过于频繁
 - 602： 短信验证码发送失败（运营商错误）
 - 603： 无效的短信验证码
 - 127： 手机号码不合法
