# 1、创建订单

| 接口定义  | http://xxx:port/rest/topic/:topic_id/order | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required |
| 请求参数  | 参数说明   | 参数类型| 备注 |
|question|问题内容| String|必选|
|self_desc|自身描述| String|必选|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|o_id |订单ID | String  | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -d '{"question":"测试问题内容！", "self_desc":"测试自身描述！"}' \
  http://host:port/rest/topic/5768d9ca91173b081eba3037/order
```
返回JSON数据：
```
{
    "code": 900,
    "o_id":"57691bba8789ff202b5968fb"
}
```

# 2、获取订单详情

| 接口定义  | http://xxx:port/rest/order/:o_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式|GET|
| auth   |required |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|订单详情|Object| 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/order/57691bba8789ff202b5968fb
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
        "updatedAt": "2016-06-21T10:49:30.444Z",    //更新时间
        "createdAt": "2016-06-21T10:49:30.444Z",    //创建时间
        "expert_id": "54f3b5fec08b6f54100c1cbe",    //专家ID
        "topic_id": "5768d9ca91173b081eba3037",     //话题ID
        "userID": "54f3b5fec08b6f54100c1cbe",       //用户ID
        "comment": "",      //订单评论
        "rating": 0,        //订单评星（0为未评星，星级取值1-5）
        "called": true,     //是否已经通话过
        "commentAt": "",    //评论时间
        "confirmAt": "",    //专家确认时间
        "rejectAt": "",     //专家拒绝时间
        "payAt": "",    //用户支付时间
        "finishAt": "",    //订单完成时间
        "self_desc": "测试自身描述！",     //用户自身描述
        "question": "测试问题内容！",      //用户问题内容
        "status": "pending",        //订单状态（pending：提问待确认，confirmed：专家已确认待支付，paid：用户已支付沟通中，toBeFinished：专家已确认结束，finished：用户已评价完毕，canceled：已取消，rejected：专家已拒绝）
        "o_id": "57691bba8789ff202b5968fb"      //订单ID
    }
}
```

# 3、获取我的订单列表

说明：获取用户发出的订单列表，支持分页，默认获取的列表不包含已取消的订单，可以通过status筛选获取订单的状态，支持获取多种状态的订单，多个状态用逗号分隔。

|接口定义|http://xxx:port/rest/orders |||
|------|------|------|------|
|请求方式|GET|||
|auth|required |||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|获取订单状态|Strinig|可选，默认不获取已取消订单|
|返回值||||
|code|状态码|int|必选|
|list |订单列表 |List|必选|
|msg|错误信息| String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G \
  -d "page=1"
  -d "limit=5"
  -d "status=pending,confirmed,paid"
  http://host:port/rest/orders
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "o_id": "57691bba8789ff202b5968fb",     //订单ID
            "userID": "54f3b5fec08b6f54100c1cbe",   //用户ID
            "status": "pending",        //订单状态
            "rating": 0,    //评星，0为未评价
            "topic": {      //订单对应的话题信息
                "topic_id": "5768d9ca91173b081eba3037",
                "title": "测试创建话题",
                "category": "留学咨询",
                "finish_count": "0"     //完成数
            },
            "expert": {     //订单对应的专家信息
                "userID": "54f3b5fec08b6f54100c1cbe",
                "nick": "昵称",
                "name": "姓名",
                "avatar": "头像",
                "title": "职位"
            },
            "banner": ""    //进行中的订单，显示一个banner
        }
    ]
}
```

# 4、专家获取订单列表

说明：获取用户发出的订单列表，支持分页，默认获取的列表不包含已取消的订单，可以通过status筛选获取订单的状态，支持获取多种状态的订单，多个状态用逗号分隔。

|接口定义|http://xxx:port/rest/expert/orders |||
|------|------|------|------|
|请求方式|GET|||
|auth|required |||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|获取订单状态|Strinig|可选，默认不获取已取消订单|
|返回值||||
|code|状态码|int|必选|
|list |订单列表 |List|必选|
|msg|错误信息| String|可选|

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
  -d "status=pending,confirmed,paid"
  http://host:port/rest/expert/orders
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "o_id": "57691bba8789ff202b5968fb",
            "userID": "54f3b5fec08b6f54100c1cbe",
            "status": "rejected",
            "rating": 0,    //评星，0为未评价
            "topic": {  //话题相关信息
                "topic_id": "5768d9ca91173b081eba3037",
                "title": "测试创建话题",
                "category": "留学咨询",
                "finish_count": "0"
            },
            "user": {   //用户相关信息
                "userID": "54f3b5fec08b6f54100c1cbe",
                "nick": "昵称",
                "avatar": "头像"
            }
        }
    ]
}
```

# 5、用户取消订单

说明：用户取消订单，可填写取消订单的原因。

|接口定义  | http://xxx:port/rest/order/:o_id/cancel | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|reason|取消订单原因|String|可选|
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
  -d '{"reason":"取消订单原因"}' \
  http://host:port/rest/order/57691bba8789ff202b5968fb/cancel
```
返回JSON数据：
```
{
    "code": 900
}
```

# 6、专家确认订单

说明：专家确认或者拒绝订单，默认两个参数都可以不传或者只传status=confirmed，这样是确认订单，如果传status=rejected，则必须传reason，这样是拒绝订单。

|接口定义  | http://xxx:port/rest/order/:o_id/confirm | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|status|订单状态|String|可选，confirmed、rejected|
|reason|拒绝原因|String|可选|
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
  -d '{"status":"rejected", "reason":"拒绝原因"}' \
  http://host:port/rest/order/57691bba8789ff202b5968fb/confirm
```
返回JSON数据：
```
{
    "code": 900
}
```

# 6、订单支付

说明：调用支付sdk对订单进行付款，客户端方面支付成功或者取消支付，都要调用[接口6.3](./pay_info.markdown#3)告知服务端。。

|接口定义  | http://xxx:port/rest/order/:o_id/pay | | |
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

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -d '{"channel":"alipay", "currency":"cny"}' \
  http://host:port/rest/order/57691bba8789ff202b5968fb/pay
```
返回JSON数据：
```
{
    "code": 900,
    "pay_id": "576b69ae7ce1fd7004cc8280",   //支付记录ID
    "charge": {}    //charge object
}
```

# 7、订单发起语音呼叫

说明：调用接口，发起电话呼叫请求，通过第三方服务给订单双方拨打电话。

|接口定义  | http://xxx:port/rest/order/:o_id/call | | |
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
  http://host:port/rest/order/57691bba8789ff202b5968fb/call
```
返回JSON数据：
```
{
    "code": 900
}
```

# 8、订单发起语音呼叫

说明：调用接口，发起电话呼叫请求，通过第三方服务给订单双方拨打电话。

|接口定义  | http://xxx:port/rest/order/:o_id/call | | |
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
  http://host:port/rest/order/57691bba8789ff202b5968fb/call
```
返回JSON数据：
```
{
    "code": 900,
    "callSid": "1607111847151275000102980075f303"   //本次呼叫的session id
}
```

# 9、查询语音呼叫的状态

说明：调用接口，发起电话呼叫请求，通过第三方服务给订单双方拨打电话。

|接口定义| http://xxx:port/rest/call/:callSid|||
| -------- | -------- | -------- | -------- |
|请求方式|GET|||
|auth|required|||
|返回值||||
|code|状态码|int|必选|
|status|呼叫状态|string||
|msg|错误信息|String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/call/1607111847151275000102980075f303
```
返回JSON数据：
```
{
    "code": 900,
    "status": "busy"    //calling：呼叫中，finished：完成，busy：第三方服务繁忙，稍后再拨
}
```

# 10、订单确认完成
说明：专家调用该接口，将订单状态设置为toBeFinished（专家确认完成状态），当订单状态变为toBeFinished的时候，就认为已经完成，此时用户直接调用评价订单的接口，订单状态直接变为finished，同时将费用直接打入专家的账户中，如果用户没有调用评价订单的接口，那么等到超时时间，订单费用会自动打入专家账户。

|接口定义  | http://xxx:port/rest/order/:o_id/finish | | |
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
  http://host:port/rest/order/57691bba8789ff202b5968fb/finish
```
返回JSON数据：
```
{
    "code": 900
}
```

# 11、评价订单

说明：只有toBeFinished状态的订单才可以进行评价，订单评价之后，状态变为finished，同时费用打入专家账户。

|接口定义  | http://xxx:port/rest/order/:o_id/comment | | |
| -------- | -------- | -------- | -------- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|comment|评价内容|String|必选|
|rating|评星|String|必选，1-5|
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
  -d '{"comment":"评价内容", "rating":"5"}' \
  http://host:port/rest/order/57691bba8789ff202b5968fb/finish
```
返回JSON数据：
```
{
    "code": 900
}
```

# 12、获取指定话题收到的评价列表

|接口定义  | http://xxx:port/rest/topic/:topic_id/comments | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值||||
|code|状态码|int|必选|
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
  http://host:port/rest/topic/5768d9ca91173b081eba3037/comments
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "comment": "测试评价订单",    //评价内容
            "rating": 5,        //评星
            "type": "phone",    //订单类型
            "commentAt": "2016-06-23T07:19:05.593Z",    //评价时间
            "userID": "54f3b5fec08b6f54100c1cbe",   //用户ID
            "user": {   //用户信息
                "userID": "54f3b5fec08b6f54100c1cbe",
                "nick": "昵称",
                "avatar": ""
            }
        }
    ]
}
```

# 13、获取指定专家收到的评价列表

|接口定义  | http://xxx:port/rest/user/:userID/comments | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值||||
|code|状态码|int|必选|
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
  http://host:port/rest/user/54f3b5fec08b6f54100c1cbe/comments
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "comment": "测试评价订单",
            "rating": 5,
            "type": "phone",
            "commentAt": "2016-06-23T07:19:05.593Z",
            "userID": "54f3b5fec08b6f54100c1cbe",
            "topic_id": "5768d9ca91173b081eba3037",
            "user": {   //用户信息
                "userID": "54f3b5fec08b6f54100c1cbe",
                "nick": "昵称",
                "avatar": ""
            },
            "topic": {  //对应的话题信息
                "topic_id": "5768d9ca91173b081eba3037",
                "title": "测试创建话题"
            }
        }
    ]
}
```

# 14、获取所有订单的所有未读聊天消息数量

|接口定义  | http://xxx:port/rest/order/unreadnum | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|||
|auth|required|||
|返回值||||
|code|状态码|int|必选|
|info|返回列表|Object|必选|
|msg|错误信息|String|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/order/unreadnum
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "total": 1,     //总未读消息数
        "list": [
            {
                "o_id": "576a32c62dad83c843ec57c3",
                "count": 1      //该订单未读消息数
            }
        ]
    }
}
```

# 15、获取所有订单的所有未读聊天消息

|接口定义  | http://xxx:port/rest/order/unreadchat | | |
| -------- | -------- | -------- | -------- |
|请求方式|GET|||
|auth|required|||
|返回值||||
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|String|可选|

说明：返回的结果按订单为单位分别展示，调用该接口获取未读聊天消息后，会立刻将所有聊天消息设置为已读。

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  http://host:port/rest/order/unreadchat
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "o_id": "576a32c62dad83c843ec57c3",
            "list": [
                {
                    "msgid": "5774bbf9058d7ea802b94ae1",
                    "from": "55697da91e7a88200995e05d",
                    "to": "560ba4eb5a83a29c23fd142f",
                    "content": "发送一条消息",
                    "createdAt": "2016-06-30T08:08:45.601Z"
                }
            ]
        }
    ]
}
```