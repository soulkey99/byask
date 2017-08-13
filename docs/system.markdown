# 1、获取首页分类区块配置信息

|接口定义|http://xxx:port/rest/home/category | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|返回值  | |||
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
  http://host:port/rest/home/category
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "categoryName": "留学咨询",   //分类名称
            "img": "图标url",             //logo
            "type": "category"            //item类型，目前只有category
        },
        {
            "categoryName": "考前辅导",
            "img": "",
            "type": "category"
        }
    ]
}
```

# 2、获取首页banner列表

|接口定义|http://xxx:port/rest/home/banner | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|返回值  | |||
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
  http://host:port/rest/home/banner
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "type": "user", //banner类型，user：用户，url：跳转链接
            "dest": "55697da91e7a88200995e05d", //banner跳转目标，用户ID或者url地址
            "img": "",  //banner显示图片
            "user": {   //banner用户信息
                "userID": "55697da91e7a88200995e05d",
                "nick": "测试139",
                "name": "测试139",
                "avatar": "",
                "intro": ""
            },
            "topic": {  //banner对应的话题信息
                "topic_id": "5763bb4e9a32c728276d5892",
                "title": "测试话题139",
                "finish_count": "0"
            }
        }
    ]
}
```

# 3、获取首页推荐列表

|接口定义|http://xxx:port/rest/home/recommend | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|返回值  | |||
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
  http://host:port/rest/home/recommend
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "tag": "热门",
            "list": [
                {
                    "type": "user",
                    "user": {
                        "userID": "55697da91e7a88200995e05d",
                        "nick": "测试139",
                        "name": "测试139",
                        "avatar": "http://oss.soulkey99.com/upload/20150801/b0b15938050691bd67832db88276d381.jpg",
                        "intro": ""
                    },
                    "topic": {
                        "topic_id": "5763bb4e9a32c728276d5892",
                        "title": "测试话题139",
                        "finish_count": "0"
                    }
                }
            ]
        }
    ]
}
```


# 4、获取发现最新话题列表

|接口定义|http://xxx:port/rest/home/discoverTopics | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值  | |||
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
  http://host:port/rest/home/discoverTopics
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "topic_info": {},
            "expert_info": {}
        }
    ]
}
```


# 5、获取发现最新小纸条列表

|接口定义|http://xxx:port/rest/home/discoverNotes | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|page|页码|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值  | |||
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
  http://host:port/rest/home/discoverNotes
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "note_id": "5770d07a2f8a793c2f1ba950",
            "userID": "54f3b5fec08b6f54100c1cbe",
            "expert_id": "560ba4eb5a83a29c23fd142f",
            "price": 1000,
            "status": "replied",
            "content": "测试小纸条内容~~~",
            "reply": "aaaaaaaaaaaaaaaaaaaaa",
            "needPay": false,
            "length": 0,
            "listen": 0,
            "ups": 0,
            "user_info": {},
            "expert": {}
        }
    ]
}
```

# 6、搜索话题、用户

|接口定义|http://xxx:port/rest/search | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|搜索类型|String|可选，默认搜话题，topic，user|
|key|关键字（urlencode）|String|必选|
|返回值||||
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
  -G \
  -d "start=1" \
  -d "limit=5" \
  -d "type=topic" \
  -d "key=%E6%B5%8B%E8%AF%95" \
  http://host:port/rest/home/discoverTopics
```
返回JSON数据：
```
//对于搜索话题
{
    "code": 900,
    "list": [
        {
            "topic_info": {},
            "expert_info": {}
        }
    ]
}
//对于搜索用户
{
    "code": 900,
    "list": [   //每个条目都是一个expert_info结构
        expert_info
    ]
}
```

# 7、获取在线参数配置列表

|接口定义|http://xxx:port/rest/onlineConfig | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|返回值||||
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
  http://host:port/rest/onlineConfig
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "key": "",
            "value": ""
        }
    ]
}
```

# 8、提交友盟推送device_token

说明：友盟推送device_token获取方式：[iOS获取device_token方法](http://dev.umeng.com/push/ios/integration?spm=0.0.0.0.OZEpZs#1_4_3)，[android获取device_token方法](http://dev.umeng.com/push/android/integration?spm=0.0.0.0.XNbK56#4_2_3)。

|接口定义|http://xxx:port/rest/pushToken | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
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
  -H "auth: xxx" \
  -d '{"token": "xxxxx"}'
  http://host:port/rest/pushToken
```

返回JSON数据：
```
{
    "code": 900
}
```


# 9、获取搜索热词列表

|接口定义|http://xxx:port/rest/search/hotWords | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值||||
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
  -G \
  -d "start=1" \
  -d "limit=5" \
  http://host:port/rest/search/hotWords
```

返回JSON数据：
```
{
    "code": 900,
    "list": ["hot1", "hot2", "hot3"]
}
```

# 10、获取用户反馈列表

|接口定义|http://xxx:port/rest/feedback | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值||||
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
  -G \
  -d "start=1" \
  -d "limit=5" \
  http://host:port/rest/feedback
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "feedback_id": "57836cca2747d324324ff144",  //反馈记录ID
            "type": "text",         //反馈类型，暂时只有text，文字
            "content": "test2",     //反馈的内容
            "direction": "u2a",     //u2a：用户提问，a2u：客服回复
            "createdAt": "2016-07-11T09:54:18.027Z",    //时间
            "read": false,      //客服是否已读
            "userID": "54f3b5fec08b6f54100c1cbe"    //用户ID
        }
    ]
}
```

# 11、添加用户反馈

|接口定义|http://xxx:port/rest/feedback | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|content|反馈内容|String|必选|
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
  -H "auth: xxx" \
  -d '{"content": "test"}' \
  http://host:port/rest/feedback
```

返回JSON数据：
```
{
    "code": 900
}
```

# 12、获取用户的小红点配置

|接口定义|http://xxx:port/rest/home/point | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|required|||
|返回值||||
|code|状态码|int|必选|
|info|账户信息|Object||
|msg|错误信息|string|可选|

说明：
 - 小纸条相关的红点，在获取相应的列表时，会清空。
 - 聊天消息相关的红点，在获取相应的订单详情时，会清空。

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/home/point
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "user": {   //用户角色
            "order_chat": 0,        //未读聊天消息
            "chat_list": [          //分订单未读消息数据
                {
                    o_id: "",       //订单ID
                    count: 0        //未读消息数
                }
            ],
            "note_replied": 0,       //专家回复小纸条
            "feedback": 0           //意见反馈回复
        },
        "expert": { //专家角色
            "order_chat": 0,        //未读聊天消息
            "chat_list": [          //分订单未读消息数据
                {
                    o_id: "",       //订单ID
                    count: 0        //未读消息数
                }
            ],
            "note_paid": 1,         //新提问小纸条
            "expert": 0             //专家资格审核通过通知
        }
    }
}
```


# 13、获取系统版本更新信息

|接口定义|http://xxx:port/rest/update | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|返回值||||
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
  http://host:port/rest/update
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "update_id": "5799ca2832cd1748248a1f13",
        "platform": "android",      //系统平台
        "code": 6,      //软件版本序号（每次更新版本自增一）
        "version": "0.0.6", //版本号
        "url": "http://www.baidu.com",      //安装包下载url
        "desc": "测试检测更新006",        //更新说明
        "time": "2016-07-28"  //版本更新时间
    }
}
```

# 14、获取首页大咖纸条列表

|接口定义|http://xxx:port/rest/home/recommendNote | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|返回值||||
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
  -H "auth: xxxx" \
  http://host:port/rest/home/recommendNote
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "note_id": "5770d07a2f8a793c2f1ba950",
            "userID": "54f3b5fec08b6f54100c1cbe",
            "expert_id": "560ba4eb5a83a29c23fd142f",
            "price": 1000,
            "anonymous": false,
            "status": "replied",
            "content": "测试小纸条内容~~~",
            "reply": "http://oss.soulkey99.com/sktalent/2016-07-13/5071780600f372f910a7ba991e6662f1.amr",
            "needPay": false,
            "length": 4,
            "listen": 5,
            "ups": 0,
            "createdAt": "2016-06-27T07:06:34.157Z",
            "replyAt": "2016-07-19T03:35:26.016Z",
            "cancelAt": "",
            "payAt": "",
            "user_info": {},    //纸条提问者信息
            "expert_info": {}   //纸条回答者信息
        }
    ]
}
```

# 15、客户端分享接口

|接口定义|http://xxx:port/rest/share | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|required|||
|请求参数|参数说明|参数类型|备注|
|type|分享类型|String|必选，user、note|
|target|分享目的|String|必选，wx, circle, qq, qzone|
|userID|被分享的userID|String|type=user时必选|
|note_id|被分享的note_id|String|type=note时必选|
|返回值||||
|code|状态码|int|必选|
|share_id|分享记录ID|String|必选|
|share_title|标题|String|必选|
|share_content|分享内容|String|必选|
|url|分享链接URL|String|必选|
|img|分享图标链接|String|可选，如果为空，取应用图标|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxx" \
  -d '{"type":"note", "target": "circle", "note_id":"5770d07a2f8a793c2f1ba950"}' \
  http://host:port/rest/share
```

返回JSON数据：
```
{
    "code": 900,
    "share_id": "57a2db0d06030820046ac488",
    "img": "",
    "share_title": "问答APP",
    "share_content": "我分享了达人测试151的小纸条，欢迎围观！！！",
    "share_url": "https://test.soulkey99.com:9071/share/shareNote.html?share_id=57a2db0d06030820046ac488"
}
```

# 16、获取分享记录

|接口定义|http://xxx:port/rest/share/:share_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|返回值||||
|code|状态码|int|必选|
|info|返回内容|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/share/57a2dddddd7c6239747d614b
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
        "type": "note",     //分享类型，note、user
        "note_id": "5770d07a2f8a793c2f1ba950"   //如果type=note返回note_id，type=user返回userID
    }
}
```

# 17、首页获取广告配置

|接口定义|http://xxx:port/rest/home/advertise | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|auth|optional|||
|请求参数|参数说明|参数类型|备注|
|resolution|分辨率|String|可选，仅限ios客户端获取splash时使用，iphone4、iphone5|
|返回值||||
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
  http://host:port/rest/home/advertise
```

返回JSON数据：
```
{
    "code": 900,
    "list": {
        "pop": true,    //首页弹出广告初始状态，true：弹出，false：隐藏
        "splash": [ //闪屏广告配置
            {
                "type": "url",  //url/user/order/topic/note，待拓展
                "dest": "", //点击跳转指定页面，可能为网址、userID、o_id、topic_id、note_id等，若为空，则点击不做任何动作
                "text": "this is android splash.",  //文字说明
                "img": "http://oss.soulkey99.com/upload/20151210/8a9e403fa692e9eadd23f439b0c1036e.png"  //图片url
            }
        ],
        "banner": [ //banner广告
            {
                "type": "url",
                "dest": "",
                "text": "this is some banner.",
                "img": "http://oss.soulkey99.com/upload/20151120/fa911cd8871cd2ee49a43cfa88605293.png"
            }
        ],
        "home": [   //首页弹出广告
            {
                "type": "url",
                "dest": "http://www.baidu.com/",
                "text": "this is some text.",
                "img": "http://oss.soulkey99.com/upload/20151119/3d4a92fbe98a4e63c383ff3b267bffae.jpg"
            },
            {
                "type": "url",
                "dest": "http://www.hao123.com/",
                "text": "this is some text222.",
                "img": "http://oss.soulkey99.com/upload/20151119/651d00513623708aa80ab59b22797070.jpg"
            }
        ]
    }
}
```

# 18、推广页面下载前输入手机号

|接口定义|http://xxx:port/rest/promote/:code | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|no|||
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|必选|
|返回值||||
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \  
  -d '{"phone":"13012341234"}' \
  http://host:port/rest/promote/xxxx
```

返回JSON数据：
```
{
    "code": 900
}
```

# 19、下载最新版本客户端

|接口定义|http://xxx:port/rest/download | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|||
|返回值|直接通过301 redirect到对应页面|


说明：浏览器内使用（扫码推广页、微信wap端等），自动根据浏览器的user-agent判断跳转的目标，安卓直接下载线上最新客户端，ios直接跳转appstore对应页面。


