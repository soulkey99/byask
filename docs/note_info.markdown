# 1、创建小纸条

| 接口定义  | http://xxx:port/rest/user/:userID/note | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required |
| 请求参数  | 参数说明   | 参数类型| 备注 |
|anonymous|是否匿名|String|默认false，可选true|
|content|问题内容| String|必选|
| 返回值    | | 
|code      | 状态码  | int | 必选 |
|note_id|小纸条ID | String  | 必选 |
|msg       | 错误信息  | String  | 可选 |

说明：向指定专家发出小纸条提问，anonymous如果不传，默认是非匿名纸条，如果传true，就是匿名，其他人无法查看提问者信息。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -d '{"content":"测试问题内容！"}' \
  http://host:port/rest/user/560ba4eb5a83a29c23fd142f/note
```
返回JSON数据：
```
{
    "code": 900,
    "note_id":"57691bba8789ff202b5968fb"
}
```

# 2、获取小纸条详情

| 接口定义  | http://xxx:port/rest/note/:note_id | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|
|auth|optional|
|返回值|| 
|code|状态码|int|必选|
|info|小纸条详情|Object|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/note/57691bba8789ff202b5968fb
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
        "updatedAt": "2016-06-27T07:15:24.705Z",
        "createdAt": "2016-06-27T07:06:34.157Z",
        "content": "测试小纸条内容~~~",    //提问内容
        "expert_id": "560ba4eb5a83a29c23fd142f",    //专家ID
        "userID": "54f3b5fec08b6f54100c1cbe",       //用户ID
        "delete": false,
        "length": 0,    //语音长度
        "needPay": false,   //是否需要支付收听回答内容
        "reply": "",    //回答语音URL
        "anonymous": false,     //是否匿名纸条（对于匿名纸条，其他人无法查看提问者信息）
        "status": "replied",    //状态（pending：待支付，paid：支付成功待回答，replied：已回答，timeout：已超时退款，canceled：已取消）
        "time_left": 1234,      //仅paid状态订单有，距离48小时超时剩余回答时间，单位毫秒
        "price": 1000,  //价格（单位：分）
        "note_id": "5770d07a2f8a793c2f1ba950",  //小纸条ID
        "ups": 0,   //点赞人数
        "listen": 0,    //偷听人数
        "payAt": "",    //支付时间
        "replyAt": "",  //回答时间
        "user": {   //提问者信息
            "userID": "54f3b5fec08b6f54100c1cbe",
            "nick": "测试修改nick",
            "avatar": ""
        },
        "expert": {     //专家信息
            "userID": "560ba4eb5a83a29c23fd142f",
            "nick": "测试151",
            "name": "151",
            "avatar": "",
            "title": ""
        }
    }
}
```
# 3、用户取消小纸条订单

说明：用户取消订单，可填写取消订单的原因。

|接口定义  | http://xxx:port/rest/note/:note_id/cancel | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|||
|auth|required|||
|返回值||||
|code|状态码|int|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/note/5770d07a2f8a793c2f1ba950/cancel
```
返回JSON数据：
```
{
    "code": 900
}
```

# 4、用户支付小纸条

|接口定义  | http://xxx:port/rest/note/:note_id/pay | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|channel|支付渠道|String|可选，默认alipay：支付宝，可选wx：微信|
|currency|币种|String|可选，默认cny|
|返回值||||
|code|状态码|int|必选|
|pay_id|支付记录ID|String|必选|
|charge|ping++ sdk charge对象|Object|必选|
|msg|错误信息|String|可选|

说明：系统自动从专家配置信息中读取支付金额，客户端方面支付成功或者取消支付，都要调用[接口6.3](./pay_info.markdown#3)告知服务端。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -d '{"channel":"alipay", "currency":"cny"}' \
  http://host:port/rest/note/5770d07a2f8a793c2f1ba950/pay
```
返回JSON数据：
```
{
    "code": 900,
    "pay_id": "576b69ae7ce1fd7004cc8280",   //支付记录ID
    "charge": {}    //charge object
}
```

# 5、用户获取自己提出的小纸条列表

| 接口定义  | http://xxx:port/rest/notes | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|获取小纸条|Strinig|可选，默认返回全部，可多选，逗号分隔|
|返回值|| 
|code|状态码|int|必选|
|list|纸条列表|List|必选|
|msg|错误信息|String|可选|

小纸条状态的说明：

|序号|status|状态|前置状态|
|---|---|---|---|
|1|pending|待支付|-|
|2|canceled|已取消|1|
|3|paid|支付成功待回答|1|
|4|replied|已回答|3|
|5|timeout|已超时退款|3|


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G \
  -d "page=1" \
  -d "limit=5" \
  -d "status=pending,paid"
  http://host:port/rest/notes
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //同2结果，不包含用户信息
}
```

# 6、用户获取自己偷听过的小纸条列表

| 接口定义  | http://xxx:port/rest/listenNotes | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值|| 
|code|状态码|int|必选|
|list|纸条列表|List|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G \
  -d "page=1" \
  -d "limit=5" \
  http://host:port/rest/listenNotes
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //小纸条列表
}
```


# 7、专家获取小纸条列表（待回答、已回答）

| 接口定义  | http://xxx:port/rest/expertNotes | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|获取状态|Strinig|可选，默认返回全部，可多选，逗号分隔|
|返回值|| 
|code|状态码|int|必选|
|list|纸条列表|List|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G \
  -d "page=1" \
  -d "limit=5" \
  -d "status=paid,replied"
  http://host:port/rest/expertNotes
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //同2结果，不包含专家信息
}
```

# 8、用户查看专家回答过的小纸条列表

| 接口定义  | http://xxx:port/rest/user/:userID/notes | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|
|auth|optional|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值|| 
|code|状态码|int|必选|
|list|纸条列表|List|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G \
  -d "page=1" \
  -d "limit=5" \
  http://host:port/rest/expertNotes
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //同2结果，对于未支付过的的纸条不包含reply内容
}
```

# 9、用户支付偷听小纸条

| 接口定义  | http://xxx:port/rest/note/:note_id/listen | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|channel|支付渠道|String|可选，默认alipay|
|currency|币种|String|可选，默认cny|
|返回值|| 
|code|状态码|int|必选|
|pay_id|支付记录ID|String|必选|
|charge|ping++ sdk charge对象|Object|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -d '{"channel":"alipay", "currency":"cny"}' \
  http://host:port/rest/note/5770d07a2f8a793c2f1ba950/listen
```
返回JSON数据：
```
{
    "code": 900,
    "pay_id": "576b69ae7ce1fd7004cc8280",   //支付记录ID
    "charge": {}    //charge object
}
```

# 10、用户获取小纸条语音内容

| 接口定义  | http://xxx:port/rest/note/:note_id/reply | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|
|auth|required|
|返回值|| 
|code|状态码|int|必选|
|reply|回复语音URL|String|必选|
|length|语音时长|Int|必选|
|msg|错误信息|String|可选|
 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/note/5770d07a2f8a793c2f1ba950/reply
```
返回JSON数据：
```
{
    "code": 900,
    "reply": "http://xxxx/xxx.amr",   //语音URL
    "legnth": 20    //语音时长
}
```

# 11、专家回复小纸条

| 接口定义  | http://xxx:port/rest/note/:note_id/reply | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|reply|语音URL|String|必选|
|length|语音时长|String|必选|
|返回值|| 
|code|状态码|int|必选|
|reply|回复语音URL|String|必选|
|length|语音时长|Int|必选|
|msg|错误信息|String|可选|
 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/note/5770d07a2f8a793c2f1ba950/reply
```
返回JSON数据：
```
{
    "code": 900
}
```
