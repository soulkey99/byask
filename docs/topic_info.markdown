# 1、用户创建话题

| 接口定义  | http://xxx:port/rest/topic | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required |
| 请求参数  | 参数说明   | 参数类型| 备注 |
|type |话题类型 | String  | 必选（暂时只有phone，通话） |
|title |话题主题 | String  | 必选 |
|category |话题分类 | String  | 必选 |
|subCategory |子分类 | String  | 必选 |
|summary |话题摘要 | String  | 可选 |
|description |详细介绍 | String  | 必选 |
|price |话题价格 | String  | 必选（单位：分） |
|duration |持续时长 | String  | 必选（单位：分钟） |
|tags |话题标签 | String  | 可选（多个以逗号分隔） |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|topic_id |话题ID | String  | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -d '{"type":"phone", "title":"测试创建话题", "summary":"测试摘要","category":"留学咨询", "subCategory": "xxxx", "introduction":"测试话题详细介绍","price":"12345","duration":"90", "tags":"标签1,标签2,标签3"}' \
  http://host:port/rest/topic
```
返回JSON数据：
```
{
    "code": 900,
    "topic_id":"5768d9ca91173b081eba3037"
}
```

# 2、获取话题详情

| 接口定义  | http://xxx:port/rest/topic/:topic_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |no |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info |话题详情 | Object| 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/topic/5768d9ca91173b081eba3037
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
        "updatedAt": "2016-06-21T06:08:10.482Z",    //更新时间
        "createdAt": "2016-06-21T06:08:10.482Z",    //创建时间
        "introduction": "测试话题详细介绍",      //详细介绍
        "summary": "测试摘要",         //摘要
        "title": "测试创建话题",      //话题主题
        "type": "phone",       //类型，phone：通话，其他待拓展
        "category": "留学咨询",         //话题分类
        "userID": "54f3b5fec08b6f54100c1cbe",   //用户ID
        "delete": false,        //删除标记
        "status": "pending",    //审核状态，pending：审核中，verified：审核通过，fail：审核失败，closed：用户主动关闭，（暂时话题不需要审核，提交之后立刻是verified状态）
        "comment_count": "0",   //评论数
        "rating": "0",          //评分
        "finish_count": "0",    //完成数
        "will_count": 0,        //感兴趣数
        "tags": [           //话题标签
            "标签1",
            "标签2",
            "标签3"
        ],
        "duration": 90,     //话题持续时长（单位：分钟）
        "price": 12345,     //话题价格（单位：分）
        "topic_id": "5768d9ca91173b081eba3037"      //话题ID
    }
}
```

# 3、用户删除话题

| 接口定义  | http://xxx:port/rest/topic/:topic_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | DELETE  |
| auth   |required |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|topic_id |话题ID | String| 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X DELETE \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/topic/5768d9ca91173b081eba3037
```
返回JSON数据：
```
{
    "code": 900,
    "topic_id":"5768d9ca91173b081eba3037"
}
```

# 4、用户关闭、恢复话题

| 接口定义  | http://xxx:port/rest/topic/:topic_id/close | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required |
| 请求参数  | 参数说明   | 参数类型| 备注 |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|topic_id |话题ID | String| 必选 |
| msg       | 错误信息  | String  | 可选 |

说明：只有verified状态下话题才可以关闭，调用该接口，可以将话题在verified和closed状态之间切换，不需要其他参数。

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/topic/5768d9ca91173b081eba3037/close
```
返回JSON数据：
```
{
    "code": 900
}
```


# 5、用户获取自己的话题列表

| 接口定义  | http://xxx:port/rest/topics | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET |
| auth   |required |
| 请求参数  | 参数说明   | 参数类型| 备注 |
|delete |是否获取已删除话题 | String  | 可选，传delete=true获取所有话题，否则只获取未删除的|
|status |获取话题状态| String  |可选，传status=all获取所有状态的话题，否则只获取已审核通过的|
|start|开始位置|String|可选，默认1|
|page |页码 | String  |可选，默认1|
|limit |获取数量 | String  |可选，默认10 |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|topic_id |话题ID | String  | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G \
  -d "delete=true" \
  -d "status=all" \
  -d "page=1" \
  -d "limit=5" \
  http://host:port/rest/topic
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "updatedAt": "2016-06-21T06:31:25.406Z",
            "createdAt": "2016-06-21T06:08:10.482Z",
            "introduction": "测试话题详细介绍",
            "summary": "测试摘要",
            "title": "测试创建话题",
            "type": "phone",
            "category": "留学咨询",
            "userID": "54f3b5fec08b6f54100c1cbe",
            "__v": 0,
            "delete": false,
            "status": "pending",
            "comment_count": "0",
            "rating": "0",
            "finish_count": "0",
            "will_count": 0,
            "tags": [
                "标签1",
                "标签2",
                "标签3"
            ],
            "duration": 90,
            "price": 12345,
            "topic_id": "5768d9ca91173b081eba3037"
        }
    ]
}
```


# 6、获取指定用户的话题列表

| 接口定义  | http://xxx:port/rest/user/:userID/topics | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |optional |
| 请求参数  | 参数说明   | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|page |页码 | String  |可选，默认1|
|limit |获取数量 | String  |可选，默认10 |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list |话题列表 |List| 必选 |
| msg       | 错误信息  | String  | 可选 |

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
  http://host:port/rest/user/54f3b5fec08b6f54100c1cbe/topics
```
返回JSON数据：
```
{
    "code": 900,
    "list":[]   //数据格式同4
}
```


# 7、获取指定分类下的话题列表

说明：此处categoryName如果是汉字，必须要进行urlencode之后再进行请求。

| 接口定义  | http://xxx:port/rest/category/:categoryName/topics | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET|||
| auth   |optional |||
| 请求参数  | 参数说明   | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|page |页码 | String  |可选，默认1|
|limit |获取数量 | String  |可选，默认10 |
| 返回值    ||||
| code      | 状态码  | int | 必选 |
|list |话题列表 |List| 必选 |
| msg       | 错误信息  | String  | 可选 |

URLENCODE示例：

|原文|URLENCODE之后|
|----|----|
|留学咨询|%E7%95%99%E5%AD%A6%E5%92%A8%E8%AF%A2|
|callcall教师|callcall%E6%95%99%E5%B8%88|


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth": xxx" \
  -G 
  -d 'page=1' \
  -d 'limit=5' \
  http://host:port/rest/category/%E7%95%99%E5%AD%A6%E5%92%A8%E8%AF%A2/topics
```
返回JSON数据：
```
{
    "code": 900,
    "list":[]   //数据格式同4
}
```



# 8、创建话题时获取话题分类列表

| 接口定义  | http://xxx:port/rest/topic/category/:categoryName |||
| -------- | -------- | -------- | -------- |
| 请求方式  |GET |
| auth   |optional |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list |分类列表|List|必选 |
| msg | 错误信息  | String  | 可选 |

说明：当不传categoryName的时候，取主分类列表，如果传categoryName，那么获取对应分类下的子分类列表。其中categoryName采用urlencode编码。

URLENCODE示例： 运营策划 ==>  %E8%BF%90%E8%90%A5%E7%AD%96%E5%88%92

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/topic/category/%E8%BF%90%E8%90%A5%E7%AD%96%E5%88%92
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        "留学咨询",
        "考前辅导",
        "心理健康",
        "游学资讯",
        "就业咨询"
    ]
}
```

