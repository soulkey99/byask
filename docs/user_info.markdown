# 1.1、获取验证码
说明：用户注册或者登陆之前，需要校验手机号与验证码，验证码获取方式有短信和语音两种，默认不传smsType，获取短信验证码，如果传smsType为voice，获取语音验证码。

| 接口定义  | http://xxx:port/rest/smscode | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |no |
| 请求参数  | 参数说明   | 参数类型| 备注 |
| phone     | 手机号 | String  | 必选 |
| smsType   | 验证码类型   | String  | 可选，voice/sms |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "13012341234", "smsType":"voice"}' \
  http://host:port/rest/smscode
```
返回JSON数据：
```
{
    "code": 900
}
```

# 1.2、用户登录
说明：用户可以使用手机号与密码登陆或者手机号与验证码登陆。验证码与密码二选一。

用户登录成功需要设置友盟推送alias以及tag。

|接口定义|http://xxx:port/rest/login | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|phone  |手机号  |String  |必选|
|smscode  |验证码  |String  |可选|
|passwd  |密码(加密后) |String  |可选|
|返回值  | 
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "13012341234", "smscode":"123123"}' \
  http://host:port/rest/login
```
密码加密方式：
```
ciphertext = sha256(plaintext).toString('hex').toUpperCase()
```
密码示例：

|明文|密文|
|---|---|
|abcdef|BEF57EC7F53A6D40BEB640A780A639C83BC29AC8A9816F1FC6C5C6DCD93C4721|
|123123|96CAE35CE8A9B0244178BF28E4966C2CE1B8385723A96A6B838858CDD6CA0A1E|
|123456|8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92|


返回JSON数据：
```
{
    "code": 900,
    "info": {
        "avatar": "头像图片url",
        "intro": "个性签名",
        "nick": "昵称",
        "email": "邮箱",
        "phone": "手机号",
        "userID": "用户ID",
        "authSign": "登陆token",
        "user_info": {},    //统一的用户信息
        "expert_status": "专家身份审核状态notVerified/pending/verified/fail",
        "expert_info": {},  //统一的专家信息
        "updateAt": "2016-06-17T11:20:16.355Z",
        "createAt": "2016-06-16T07:09:04.308Z",
        "lastLogin": 1466151267148,
        "has_passwd": true    //是否设置过密码，如果没设置过密码，要强制用户设置
    }
}
```

# 1.3、自动登录
说明：客户端使用上次的authSign自动登陆获取新的authSign。

自动登录成功需要设置友盟推送alias以及tag。

|接口定义|http://xxx:port/rest/autoLogin | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|userID  |用户ID  |String  |必选|
|authSign  |  |String  |必选|
|返回值  | 
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"userID": "xxxx", "authSign":"xxxx"}' \
  http://host:port/rest/autoLogin
```
返回JSON数据：
```
//同用户登录
```

# 1.4、用户注册
说明：新用户注册账号，该账号可同时供callcall教师以及本应用使用（仅手机号登陆通用）。如果注册时返回用户已经注册过，那么提示用户直接登陆。

|接口定义|http://xxx:port/rest/register | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|no|||
|请求参数|参数说明|参数类型|备注|
|phone  |手机号  |String  |必选|
|smscode  | 短信验证码 |String  |必选|
|nick|昵称或者第三方昵称|String|必选|
|passwd|密码|String|必选|
|avatar|头像或者第三方头像|String|必选|
|返回值  | |||
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "xxxx", "smscode":"xxxx"}' \
  http://host:port/rest/register
```
返回JSON数据：
```
//同用户登录
```

# 1.5、获取用户信息
说明：获取用户的个人信息，允许未登录状态调用，如果没传id，那么必须是登陆状态才行，获取的是当前登陆用户的个人信息。

|接口定义|http://xxx:port/rest/user/:id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|返回值  | |||
|code|状态码|int|必选|
|info|用户信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxxx " \
  http://host:port/rest/user/560ba4eb5a83a29c23fd142f
```
返回JSON数据：
```
//同用户登录
```

# 1.6、获得专家个人介绍内容

|接口定义|http://xxx:port/rest/user/:userID/intro | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|返回值  | |||
|code|状态码|int|必选|
|info|用户信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxxx " \
  http://host:port/rest/user/560ba4eb5a83a29c23fd142f/intro
```
返回JSON数据：
```
  {
      code: 900,
      self_intro: '',   //个人介绍
      banner: ''        //个人图片
  }
```

# 1.7、设置、修改密码

说明：如果用户之前设置过密码，那么需要传递旧密码和新密码，如果用户之前未设置过密码，那么只传新密码即可。通过用户登录之后的has_passwd字段来判定用户是否设置过密码。

|接口定义|http://xxx:port/rest/user/passwd | | |
| ---- | ---- | ---- | ---- |
|请求方式|PUT|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|old_passwd|旧密码（加密后）|String|可选，未设置过密码可不传|
|new_passwd|新密码（加密后）|String|必选|
|返回值  | |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxxx " \
  -d "{"old_passwd":"xxxx", "new_passwd":"yyyy"}"
  http://host:port/rest/user/passwd
```
返回JSON数据：
```
//同修改用户信息
```

# 1.8、用户重置密码

|接口定义|http://xxx:port/rest/user/resetPasswd | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|no|||
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|必选|
|smscode|短信验证码|String|必选|
|new_passwd|新密码（加密后）|String|必选|
|返回值||||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d "{"phone":"xxxx", "smscode":"yyyy", "new_passwd":"zzzz"}"
  http://host:port/rest/user/passwd
```
返回JSON数据：
```
//同修改密码
```

# 1.9、关注用户

|接口定义|http://xxx:port/rest/follow/:userID|||
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|action|操作类型|String|可选|
|返回值||||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

说明：参数action=un，表示取消关注，默认不传action，表示关注用户。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d "{"action":"un"}"
  http://host:port/rest/follow/54f3b5fec08b6f54100c1cbe
```
返回JSON数据：
```
//同修改密码
```

# 1.10、获取关注用户列表

|接口定义|http://xxx:port/rest/follows | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page |页码 | String  |可选，默认1|
|limit |获取数量 | String  |可选，默认10 |
|返回值||||
|code|状态码|int|必选|
|list |返回列表 |List| 必选 |
|msg|错误信息|string|可选|

说明：关于分页获取数据的功能，start和page参数二选一，如果都传，以start参数优先。如果都没传，那么默认获取第一页的内容。

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -G \
  -d 'page=1' \
  -d 'limit=5' \
  http://host:port/rest/follows
```

# 1.11、修改用户信息
说明：用户修改个人信息，可以只传部分字段，未传字段不会修改。

|接口定义|http://xxx:port/rest/user/ | | |
| ---- | ---- | ---- | ---- |
|请求方式|PUT|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|nick|昵称|String|可选|
|name|姓名|String|可选|
|avatar|头像|String|可选|
|intro|个性签名|String|可选|
|note_price|小纸条价格|String|可选，单位：分|
|返回值  | |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxxx " \
  -d "{"nick":"昵称", "avatar":"头像", "intro":"个性签名", "note_price":"1500"}" \
  http://host:port/rest/user
```
返回JSON数据：
```
{
    "code": 900,
    "updateAt": 时间戳
}
```



# 1.12、申请专家资格、修改专家申请信息

|接口定义|http://xxx:port/rest/user/apply | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|name|姓名|String|必选|
|company|就职公司|String|必选|
|title|职位|String|必选|
|work_year|工作年限|String|必选|
|city|城市|String|必选|
|card|名片图片|String|必选|
|banner|个性图片|String|必选|
|avatar|头像|String|必选|
|major|特长标签|String|必选，多个以逗号分隔|
|category|分类|[Object]|必选|
|note_price|小纸条价格|String|必选|
|self_intro|自我介绍|String|必选|
|返回值  | |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxxx " \
  -d "{"name":"申请姓名", "company":"公司", "title":"职务", "work_year":"年限", "city":"城市", "card":"名片", "banner":"个性照片", "avatar":"头像", "major":"特长,标签", "category": [{"categoryName": "创业辅导", "subCategory": ["创业案例", "商业计划"]}],"self_intro":"个人介绍"}" \
  http://host:port/rest/user/apply
```
返回JSON数据：
```
{
    "code": 900
}
```


# 1.13、获取最新提交的专家资格申请内容

|接口定义|http://xxx:port/rest/user/apply | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|返回值  | |||
|code|状态码|int|必选|
|info|返回信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxxx " \
  http://host:port/rest/user/apply
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
        "updatedAt": "2016-07-04T03:11:37.468Z",
        "createdAt": "2016-07-04T03:11:37.468Z",
        "info": {
            "self_intro": "个人介绍",
            "note_price": 1000,
            "company": "公司",
            "category": [],
            "major": [
                "特长",
                "标签"
            ],
            "banner": "个性照片",
            "work_year": "年限",
            "card": "名片",
            "finished": 0,
            "name": "申请姓名",
            "avatar": "头像",
            "title": "职务",
            "id": null
        },
        "userID": "54f3b5fec08b6f54100c1cbe",
        "status": "pending",
        "apply_id": "5779d3e976a371400b9787d8"
    }
}
```

# 1.14、用户注销登录

用户注销成功需要删除友盟推送alias以及tag。

|接口定义|http://xxx:port/rest/logout | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|userID  |用户ID  |String  |必选|
|authSign  |  |String  |必选|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"userID": "xxxx", "authSign":"xxxx"}' \
  http://host:port/rest/logout
```

返回JSON数据
```
{
    "code": 900
}
```

# 1.15、第三方登录

说明：用户采用第三方登录，如果账号不存在，那么直接创建一个新的账号，

|接口定义|http://xxx:port/rest/ssoLogin | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|ssoType|第三方登录类型|String|可选：weibo、weixin、qq，第三方登录时使用|
|openid|第三方登录openid|String|可选，第三方登录时使用|
|access_token|第三方access token|String|必选|
|refresh_token|第三方refresh token|String|必选|
|nick|第三方nick|String|可选，weixin可不传|
|avatar|第三方avatar|String|可选，weixin可不传|
|返回值  | 
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|


 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "13012341234", "smscode":"123123"}' \
  http://host:port/rest/ssoLogin
```

 返回JSON数据：
```
 //同用户登录
```

# 1.16、绑定第三方登录信息

|接口定义|http://xxx:port/rest/user/sso | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|ssoType|第三方登录类型|String|必选：weibo、weixin、qq|
|openid|第三方登录openid|String|必选|
|access_token|第三方access token|String|必选|
|refresh_token|第三方refresh token|String|必选|
|nick|第三方nick|String|必选|
|avatar|第三方avatar|String|必选|
|expire|第三方expire|String|必选|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  -d '{"ssoType": "weibo", "openid":"xxxx", "token":"xxxx", "nick":"xxxx", "avatar":"xxxx", "expire":"xxxx"}' \
  http://host:port/rest/user/sso
```

返回JSON数据
```
{
    "code": 900
}
```

# 1.17、获取第三方登录信息

|接口定义|http://xxx:port/rest/user/sso | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  http://host:port/rest/user/sso
```

返回JSON数据
```
{
    "code": 900,
    "info": {
        "userID": "54f3b5fec08b6f54100c1cbe",
        "weibo": {
            "expire": 0,
            "avatar": "",
            "nick": "",
            "token": "",
            "openid": ""
        },
        "weixin": {
            "expire": 0,
            "avatar": "",
            "nick": "",
            "token": "",
            "openid": ""
        },
        "qq": {
            "expire": 0,
            "avatar": "",
            "nick": "",
            "token": "",
            "openid": ""
        }
    }
}
```


# 1.18、获取专家统计信息

|接口定义|http://xxx:port/rest/user/stats | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|stats|统计信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  http://host:port/rest/user/stats
```

返回JSON数据
```
{
    "code": 900,
    "stats": {
        "total": {
            "money": 0      //总收益
        },
        "order": {  //订单相关
            "money": 0,         //订单收益
            "finished": 2,      //完成订单
            "rating": 8,        //评分
            "confirm_rate": 0,      //接单率
            "confirm_rate_text": "暂无"       //接单率（文字描述）
        },
        "note": {   //纸条相关
            "price": 500,       //纸条价格
            "money": 0,         //纸条收益
            "replied": 0,       //回答数
            "listened": 0,      //偷听数
            "confirm_rate": 0,      //纸条接单率
            "confirm_rate_text": "暂无"   //纸条接单率（文字描述）
        }
    }
}
```

# 1.19、获取账户余额

|接口定义|http://xxx:port/rest/user/money | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|money|余额信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  http://host:port/rest/user/money
```

 返回JSON数据
```
{
    "code": 900,
    "money": {
        "money": 24812,     //账户余额
        "withdrawn": 0,     //已提现
        "withdrawing": 0    //提现中
    }
}
```

# 1.20、是否设置过支付密码、密保问题、提现账户

|接口定义|http://xxx:port/rest/pay/checkInfo | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|passwd|支付密码|Boolean|必选|
|questions|密保问题|Boolean|必选|
|withdraw|提现账户|Boolean|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  http://host:port/rest/pay/checkInfo
```

 返回JSON数据
```
{
    "code": 900,
    "passwd": false,
    "questions": false,
    "withdraw": false
}
```

# 1.21、获取指定分类下的专家列表

说明：此处categoryName必须要进行urlencode之后再进行请求，1.获取主分类下用户列表，2.获取子分类下用户列表。

|接口定义|1：http://xxx:port/rest/category/:categoryName/experts <br> 2：http://xxx:port/rest/category/:categoryName/subCategory/:subCategoryName/experts | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  -G 
  -d 'page=1' \
  -d 'limit=5' \
  http://host:port/rest/category/%E8%81%8C%E4%B8%9A%E8%A7%84%E5%88%92/experts
```

 返回JSON数据
```
{
    "code": 900,
    "list": []      //expert_info格式
}
```





# 1.29、删除当前登陆用户账号（测试专用）

|接口定义|http://xxx:port/rest/test/kill | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  http://host:port/rest/test/kill
```

 返回JSON数据
```
{
    "code": 900
}
```

