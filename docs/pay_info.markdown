# 1、获取支付订单的详细信息

|接口定义|http://xxx:port/rest/pay/:pay_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|返回值| |||
|code|状态码|int|必选|
|info|详细信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/pay/576b69ae7ce1fd7004cc8280
```
返回JSON数据
```
{
    "code": 900,
    "info": {
        "updatedAt": "2016-06-23T04:46:38.190Z",
        "createdAt": "2016-06-23T04:46:38.190Z",
        "o_id": "57691bba8789ff202b5968fb",     //对应预约订单id
        "note_id": "",      //对应小纸条ID
        "expert_id": "54f3b5fec08b6f54100c1cbe",    //专家ID
        "userID": "54f3b5fec08b6f54100c1cbe",       //用户ID
        "amount": 12356,    //订单金额
        "money": 12356,     //实际支付金额
        "charge": {     //ping++SDK charge object
        },
        "desc": "",     //订单描述
        "client_status": "pending",     //客户端支付状态（pending、success、cancel、invalid）
        "status": "pending",            //实际支付状态（pending、paid、fail、cancel）
        "subject": "支付预约订单_2016-06-23",     //支付说明
        "currency": "cny",      //币种
        "channel": "alipay",    //支付渠道
        "type": "order",        //支付订单类型，order：预约订单，note：小纸条订单
        "pay_id": "576b69ae7ce1fd7004cc8280"    //支付记录ID
    }
}
```

# 2、获取支付订单状态

|接口定义|http://xxx:port/rest/pay/:pay_id/status | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|返回值| |||
|code|状态码|int|必选|
|info|详细信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/pay/576b69ae7ce1fd7004cc8280/status
```
返回JSON数据：
```
{
    "code": 900,
    "status": "pending",
    "client_status": "pending"
}
```

# 3、设置客户端支付状态

|接口定义|http://xxx:port/rest/pay/:pay_id/status | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|status|支付状态|String|必选，success、fail、cancel、invalid|
|返回值| |||
|code|状态码|int|必选|
|info|详细信息|Object|必选|
|msg|错误信息|string|可选|

说明：客户端向服务端汇报支付状态，参见 [获取支付结果](https://github.com/PingPlusPlus/pingpp-android/blob/master/docs/Ping%2B%2B%E5%AE%89%E5%8D%93SDK%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3.md#五获取支付状态)

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"status": "success"}'
  http://host:port/rest/pay/576b69ae7ce1fd7004cc8280/status
```
返回JSON数据：
```
{
    "code": 900
}
```

# 4、提现

|接口定义|http://xxx:port/rest/pay/withdraw | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|passwd|支付密码（加密后）|String||
|amount|提现金额|String|单位：分|
|返回值| |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

说明：每个自然月只能提现1次。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"passwd": "xxxx", "amount": "1000"}'
  http://host:port/rest/pay/withdraw
```

返回JSON数据：
```
{
    "code": 900
}
```

# 5、设置支付密码

|接口定义|http://xxx:port/rest/pay/passwd | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|passwd|支付密码（加密后）|String||
|返回值| |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

说明：需要验证支付密码。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"passwd": "xxxx"}'
  http://host:port/rest/pay/passwd
```

返回JSON数据：
```
{
    "code": 900
}
```

# 6、设置密保问题

|接口定义|http://xxx:port/rest/pay/question | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|answer1|问题1答案|String||
|answer2|问题2答案|String||
|answer3|问题3答案|String||
|返回值| |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

说明：每个自然月只能提现1次。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"answer1": "xxxx", "answer2": "xxxx", "answer3": "xxxx"}'
  http://host:port/rest/pay/question
```

返回JSON数据：
```
{
    "code": 900
}
```

# 7、设置提现账户

|接口定义|http://xxx:port/rest/pay/withdrawInfo | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|smscode|短信验证码|String||
|type|支付账号类型|String|暂时只有alipay，支付宝|
|id|支付账号ID|String|必填|
|name|支付账号昵称|String|必填|
|返回值| |||
|code|状态码|int|必选|
|msg|错误信息|string|可选|


 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"smscode": "123123", "type": "alipay", "id": "xxxx", "name": "xxxx"}'
  http://host:port/rest/pay/withdrawInfo
```

返回JSON数据：
```
{
    "code": 900
}
```

# 8、获取提现账户

|接口定义|http://xxx:port/rest/pay/withdrawInfo | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|返回值| |||
|code|状态码|int|必选|
|info|账户信息|Object||
|msg|错误信息|string|可选|


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/pay/withdrawInfo
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "type": "alipay",
        "id": "",
        "name": ""
    }
}
```

# 9、是否设置过支付密码、密保问题、提现账户

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


