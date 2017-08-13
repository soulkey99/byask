# 1、mqtt连接

即时通讯部分使用mqtt协议，客户端mqtt连接参数如下：
 - 连接地址：服务器地址
 - 连接端口：8075
 - clientid：userID
 - username：userID
 - password：authSign
 - keepalive：30
 - cleansession：false

使用mqtt连接成功后，服务器会自动为该客户端订阅如下topic，客户端方面无需手动操作，之后发给该用户的所有消息都直接通过该topic进行发送。
```
  $sktalent/clients/:userID
```

用户发送的消息，都统一publish到如下topic，然后由服务端统一进行处理。
```
  $sktalent/server/mqttserver
```

# 2、MQTT数据格式定义
使用MQTT发送消息的时候，其格式定义如下：
```
{
    "msgid": "",    //客户端为该条消息一个随机串
    "from": "",     //消息发送者
    "to": "",       //消息接收者
    "type": "order_chat",   //消息类型，order_chat：订单会话，order：订单相关通知，note：小纸条相关通知
    "payload": { }        //消息数据（依据类型不同而结构不同）
}
```
对于某些类型的消息（order_chat），需要知道发送状态，那么消息到达服务端后，会给发送者一个反馈，其格式定义如下：
```
{
    "msgid": "",
    "type": "sent"
}
```

消息被接收者收到后，接收者会给服务端一个反馈（该反馈仅在订单聊天页面内进行，聊天页之外不发送）：
```
{
   "msgid": "",
   "from": "",
   "to": "",
   "type": "received"
}
```

服务端将反馈转发给原消息的发送者
```
{
   "msgid": "",
   "type": "received"
}
```

 msgid生成方法，msgid实际上是一个类型为ObjectID的字符串，每一位都有特定的涵义，这里为了简便，只取了一些随机数进行生成。[参考代码1](https://github.com/mongodb/mongo-csharp-driver/blob/master/src/MongoDB.Bson/ObjectModel/ObjectId.cs#L247)，[参考代码2](https://github.com/mongodb/mongo-java-driver/blob/master/bson/src/main/org/bson/types/ObjectId.java#L260)
```
function ObjectId() {
    var timestamp = (Date.now() / 1000) & 0xFFFFFFFF;
    var cnt1 = (Math.random() * 100000000) & 0xFFFFFFFF;
    var cnt2 = (Math.random() * 100000000) & 0xFFFFFFFF;
    return (new Buffer([
        timestamp >> 24,
        timestamp >> 16,
        timestamp >> 8,
        timestamp,
        cnt1 >> 24,
        cnt1 >> 16,
        cnt1 >> 8,
        cnt1,
        cnt2 >> 24,
        cnt2 >> 16,
        cnt2 >> 8,
        cnt2
    ])).toString('hex');    //结果为一个24位的16进制字符串
}
```

# 3、关于友盟推送的集成
应用程序离线状态下，消息通过友盟推送通道进行下发，需要集成友盟推送服务：[友盟推送iOS SDK使用指南](http://dev.umeng.com/push/ios/integration)，[友盟推送安卓SDK使用指南](http://dev.umeng.com/push/android/integration)。

以安卓平台为例，应用程序启动后，需要进行如下操作：
 - 设置channel id，参见文档4.1.4
 - 设置tag，参见文档7.2，标签内容为：1). 渠道号，2). 版本号

用户登录成功之后，再对友盟推送的一些参数进行配置：
 - 设置alias，参见文档7.3，调用setExclusiveAlias方法，别名为用户的userID，alias type为：calltalent。
 - 设置tag，参见文档7.2，如果用户专家资格已经审核通过，那么增加一个tag：expert，减少一个tag：user，如果用户没有通过专家资格审核，那么增加一个tag：expert，减少一个tag：user。
 - 向服务端上报device_token，参见[提交友盟推送token](./system.markdown#8-device_token)

如果用户注销登陆，那么需要在调用注销接口的同时，手动将用户登录成功之后设置的alias和tag全都删除掉。

以上内容iOS平台设置方式请参见SDK文档1.3。


# 4、聊天
聊天仅支持纯文字，客户端发送数据payload结构如下：
```
{
    "o_id": "",         //聊天对应的订单ID
    "expert": true,     //聊天消息发送给专家：true，给用户：false
    "content": ""       //文字内容
}
```

服务端为上面的结构添加一个时间戳t，发送给接收者。
```
{
    "o_id": "",
    "expert": true,
    "content": "",
    "t": ""     //时间戳
}
```

# 5、状态通知

## 5.1、订单状态通知：

订单状态通知，type=order，payload格式以及详细说明如下：

```
    {
        status: '',     //订单状态 
        o_id: ''        //订单ID
    }
```

关于status各种取值情况如下：

|status|消息说明|消息接收方|
|---|---|---|
|pending|订单提出，待专家确认|专家|
|confirmed|专家已确认，待用户支付|用户|
|rejected|专家已拒绝|用户|
|paid|用户已支付，可以沟通|专家|
|toBeFinished|专家已确认完成，待用户评价|用户|
|finished|用户已评价|专家|

## 5.2、小纸条状态通知：

小纸条状态通知，type=note，payload格式以及详细说明如下：

```
    {
        status: '',     //小纸条状态 
        note_id: ''     //小纸条ID
    }
```

关于status各种取值情况如下：

|status|消息说明|消息接收方|
|---|---|---|
|paid|小纸条提出，待专家回答|专家|
|replied|专家已回答|用户|

## 5.3、意见反馈回复通知：

客服给用户回复意见反馈之后，会有一个mqtt消息来通知用户，type=feedback，payload格式以及详细说明如下：

```
    {
        content: ''     //回复内容 
    }
```

## 5.4、专家资格审核通知：

客服审核专家资格之后，会有一个mqtt消息来通知客户审核成功或者失败，type=expert，payload格式如下：

```
{
    status: '', //verified：审核成功，fail：审核失败
    content: '' //如果是审核成功，那么content='update'表示专家本次为更新个人信息，content='apply'表示本次为初次申请专家资格，如果是审核失败，那么content内容为管理员输入的审核失败的原因
}
```


# 6、友盟推送数据格式

具体详细说明请参见[友盟推送文档](http://dev.umeng.com/push/ios/api-doc?spm=0.0.0.0.epvOcX#2_1_3)。

## 6.1、iOS客户端：

### 6.1.1、聊天消息

```
    action: 'order_chat'   //固定类型
    o_id: ''        //订单ID
    alert: ''       //消息内容
```


### 6.1.2、订单状态通知

```
    action: 'order'     //固定类型
    o_id: ''        //订单ID
    status: ''      //订单状态
    alert: ''       //提示文字
```

### 6.1.3、小纸条状态通知

```
    action: 'note'     //固定类型
    note_id: ''        //小纸条ID
    status: ''      //小纸条状态
    alert: ''       //提示文字
```

### 6.1.4、启动WebView

```
    action: 'webview'   //固定类型
    url: ''         //网址
```


## 6.2、android客户端

### 6.1.1、公共参数：

```
    body: {
        ticker: '问答CallTalent，您有一条新消息！'
        title: '问答CallTalent'
        text: ''    //具体说明文字，视情况不同
        play_vibrate: 'true'
        play_lights: 'true'
        play_sound: 'true'
    }
    extra: {}
```

### 6.1.2、聊天消息

```
    body.after_open: go_activity     //固定值
    body.activity: ''        //待客户端定
    extra.o_id: ''        //订单ID
```


### 6.1.3、订单状态通知

```
    body.after_open: go_activity     //固定值
    extra.o_id: ''        //订单ID
    extra.status: ''      //订单状态
```

### 6.1.3、小纸条状态通知

```
    body.after_open: go_activity     //固定值
    extra.note_id: ''        //小纸条ID
    extra.status: ''      //小纸条状态
```

### 6.1.4、启动WebView

```
    body.after_open: 'go_url'  //固定值
    body.url: ''        //网址
```

