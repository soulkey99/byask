# 1、管理员相关

## 1.1、管理员登录

|接口定义|http://xxx:port/rest/login | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|userName|用户名|String|必选|
|passwd|密码|String|必选|
|返回值|
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

## 1.2、管理员注销登陆

|接口定义|http://xxx:port/rest/logout | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 1.3、创建管理员

|接口定义|http://xxx:port/rest/admin/ | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|userName|用户名|String|必选|
|passwd|密码|String|必选|
|remark|备注|String|必选|
|type|类型|String|必选，super/admin|
|sections|授权区域|String|JSON序列化|
|返回值|
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 1.4、编辑管理员

|接口定义|http://xxx:port/rest/admin/:userID | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|userName|用户名|String|必选|
|passwd|密码|String|必选|
|remark|备注|String|必选|
|type|类型|String|必选，super/admin|
|sections|授权区域|String|JSON序列化|
|delete|是否删除|String|可选，true/false|
|返回值|
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 1.5、获取管理员列表

|接口定义|http://xxx:port/rest/admin/list | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|delete|是否获取已删除|String|可选，true/false|
|返回值|
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|


# 2、用户以及专家相关

## 2.1、获取待审核状态的专家列表

|接口定义|http://xxx:port/rest/expert/apply | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|


## 2.2、审核专家资格

|接口定义|http://xxx:port/rest/expert/check | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|apply_id|申请ID|String|必选|
|status|审核结果|String|必选，verified、fail|
|reason|拒绝原因|String|如果未通过，必填，多个原因用逗号分隔|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 2.3、根据昵称或手机号搜索用户

说明：手机号和昵称二选一，getExpert=true则仅返回专家列表，getBlack=true则返回当前系统中生效状态的黑名单用户列表，getBlack=history获取系统中已经过期的黑名单用户列表，getAll=true时，忽略分页，返回所有查询结果。

|接口定义|http://xxx:port/rest/users | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|可选|
|nick|昵称|String|可选|
|getExpert|是否获取专家|String|可选，如果传true则仅返回专家列表|
|getBlack|是否获取黑名单列表|String|可选，true/history|
|getAll|是否获取全部|String|可选，如果传true则返回所有结果，忽略分页|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 2.4、创建用户

说明：使用此接口创建一个新的用户，相当于客户端的注册功能，如果expert_status=verified，那么就是创建专家，下面那些关注专家的信息都要必填，否则就是创建普通用户，专家相关的信息不用填写。

|接口定义|http://xxx:port/rest/user | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|必选|
|nick|昵称|String|必选|
|avatar|头像|String|必选|
|name|姓名|String|必选|
|passwd|密码(加密后)|String|必选|
|expert_status|是否专家|String|可选|
|city|常驻城市|String|可选|
|note_price|小纸条价格|String|必填，单位：分|
|title|头衔、职务|String|可选|
|company|公司|String|可选|
|card|名片、工牌|String|可选|
|work_year|工作年限|String|可选|
|banner|个性照片|String|可选|
|category|分类|[Object]|JSON形式提交|
|major|特长标签|String|可选，多个用逗号分隔|
|self_intro|自我介绍|String|可选|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 2.5、获取指定用户信息

|接口定义|http://xxx:port/rest/user/:userID | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|返回值| 
|code|状态码|int|必选|
|info|用户信息|Object|必选|
|msg|错误信息|string|可选|

## 2.6、编辑用户信息

说明：使用该接口修改系统中已注册用户的信息，相关字段如果不传，那么就是不改，传了就是修改。

|接口定义|http://xxx:port/rest/user/:userID | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|nick|昵称|String|可选|
|avatar|头像|String|可选|
|name|姓名|String|可选|
|expert_status|是否专家|String|可选，verified/fail|
|note_price|小纸条价格|String|可选，单位：分|
|city|常驻城市|String|可选|
|title|头衔、职务|String|可选|
|company|公司|String|可选|
|card|名片、工牌|String|可选|
|work_year|工作年限|String|可选|
|banner|个性照片|String|可选|
|major|特长标签|String|可选，多个用逗号分隔|
|self_intro|自我介绍|String|可选|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 2.7、获取用户资金列表

|接口定义|http://xxx:port/rest/user/:userID/money | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|类型|String|可选，多个用逗号分隔，order、note、listenNote、withdraw|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 2.8、获取用户操作日志列表

说明：获取用户操作日志列表，两个接口，返回数据一样，接口1是在已知用户ID的情况下获取指定用户日志列表，接口2获取所有用户日志列表，同时可以根据给定条件进行筛选。

|接口定义|1、http://xxx:port/rest/user/:userID/logs </br> 2、http://xxx:port/rest/user/logs| | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|action|操作类型|String|可选|
|phone|手机号|String|可选|
|imei|手机imei码|String|可选|
|mac|手机mac地址|String|可选|
|ip|请求ip地址|String|可选|
|platform|操作系统类型|String|可选，android，ios|
|client|版本号|String|可选|
|channel|渠道号|String|可选|
|startAt|开始时间|String|可选|
|endAt|截止时间|String|可选|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 2.9、获取黑名单用户列表

说明：该接口获取当前系统中的黑名单用户列表，不传type，默认获取当前生效状态的黑名单，按照解除黑名单时间升序排序，type=history获取系统中已过期的历史黑名单列表，按照解除黑名单时间降序排列，可以手动指定排序，sort=asc，强制升序排列，sort=desc强制降序排列。

|接口定义|http://xxx:port/rest/user/blacklist | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|类型|String|可选，type=history获取历史黑名单列表|
|sort|排序|String|可选，asc升序、desc降序|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 2.10、用户加入、解除黑名单

|接口定义|http://xxx:port/rest/user/:userID/black | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|block_util|解除时间|String|加黑时必填，json date|
|block_reason|加黑原因|String|加黑时必填|
|action|类型|String|可选，默认是加黑，action=remove是解除|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|


# 3、首页配置相关
## 3.1、获取首页banner列表

|接口定义|http://xxx:port/rest/banner | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|valid|是否可用|String|true/false|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 3.2、新增、编辑banner

说明：如果不传banner_id的时候，就是新增。

|接口定义|http://xxx:port/rest/banner/:banner_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|img|图片|String|必选|
|dest|跳转目标|String|必选|
|remark|备注|String|必选|
|valid|是否可用|String|必选|
|seq|顺序|String|必选|
|startAt|开始时间|String|必选|
|endAt|截止时间|String|必选|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 3.3、获取首页推荐列表

|接口定义|http://xxx:port/rest/recommend | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|valid|是否可用|String|true/false|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 3.4、新增、编辑推荐内容

说明：如果不传recommend_id的时候，就是新增，当category=hotNote的时候，必须设置type=note，且dest为note_id。

|接口定义|http://xxx:port/rest/recommend/:recommend_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|dest|跳转目标|String|必选|
|category|推荐分类|String|必选，hot：热门用户，hotNote：热门纸条|
|remark|备注|String|必选|
|valid|是否可用|String|必选|
|seq|顺序|String|必选|
|startAt|开始时间|String|必选，JSON date|
|endAt|结束时间|String|必选，JSON date|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 3.5、获取首页分类列表

说明：如果不传categoryName的时候，就是获取全部。

|接口定义|http://xxx:port/rest/category/:categoryName | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|valid|是否可用|String|true/false|
|type|获取分类|String|可选，category/subCategory|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 3.6、新增、编辑分类内容

说明：如果不传category_id的时候，就是新增。

|接口定义|http://xxx:port/rest/category/:category_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|categoryName|分类名称|String|必选|
|type|类型|String|必选，category、subCategory|
|subCategoryName|子分类名称|String|type|
|order_banner|订单列表横幅图片|String|type=category时必选|
|img|图片|String|type=category时必选|
|desc|备注|String|必选|
|valid|是否可用|String|必选|
|seq|顺序|String|必选|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 3.7、获取广告配置列表

|接口定义|http://xxx:port/rest/home/advertise | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|valid|是否可用|String|可选|
|platform|操作系统|String|可选，android、ios|
|type|图片|String|类型，splash，banner，homePop，homeHide|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 3.8、新增、编辑广告内容

说明：如果不传ad_id的时候，就是新增。

|接口定义|http://xxx:port/rest/home/advertise/:ad_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|startAt|生效时间|String|必选，json date|
|endAt|失效时间|String|必选，json date|
|type|类型|String|必选，splash，banner，homePop，homeHide|
|platform|订单列表横幅图片|String|必选，操作系统，android，ios，多个用逗号分隔|
|valid|图片|String|可选，是否生效|
|remark|备注|String|可选|
|content_type|是否可用|String|必选，跳转类型，url，user，order，topic，note，待扩展|
|content_dest|顺序|String|必选，跳转目标，网页链接，userID，o_id，topic_id，note_id，待拓展|
|content_text|文字内容|String|可选|
|content_img|图片地址|String|必选|
|seq|展示顺序|String|可选|
|resolution|分辨率|String|仅ios splash下生效，iphone4，iphone5|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 3.9、预览当前广告

说明：如果不传time的时候，就是预览当前时间点。

|接口定义|http://xxx:port/rest/home/advertise/preview | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|platform|操作系统|String|必选，android、ios|
|time|时间点|String|可选，json date|
|resolution|分辨率|String|仅ios时传递，iphone4，iphone5|
|返回值| 
|code|状态码|int|必选|
|info|返回信息|Object|必选|
|msg|错误信息|string|可选|




# 4、话题、订单、小纸条相关

## 4.1、获取指定用户的话题列表

|接口定义|http://xxx:port/rest/user/:userID/topics | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|delete|是否获取已删除|String|可选，true为获取已删除，不传默认不获取|
|status|话题状态|String|可选，verified，closed，默认不传获取全部|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 4.2、为指定用户创建话题

|接口定义|http://xxx:port/rest/user/:userID/topic | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|type |话题类型 | String  | 必选（暂时只有phone，通话） |
|title |话题主题 | String  | 必选 |
|category |话题分类 | String  | 必选 |
|subCategory |子分类 | String  | 必选 |
|summary |话题摘要 | String  | 可选 |
|description |详细介绍 | String  | 必选 |
|price |话题价格 | String  | 必选（单位：分） |
|duration |持续时长 | String  | 必选（单位：分钟） |
|tags |话题标签 | String  | 可选（多个以逗号分隔） |
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|


## 4.3、编辑指定话题

|接口定义|http://xxx:port/rest/topic/:topic_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|type |话题类型 | String  | 可选（暂时只有phone，通话） |
|title |话题主题 | String  |可选|
|category |话题分类 | String  |可选|
|subCategory |子分类 | String  |可选|
|summary |话题摘要 | String|可选 |
|description |详细介绍 | String  | 必选 |
|price |话题价格 | String  | 可选（单位：分） |
|duration |持续时长 | String  |可选（单位：分钟） |
|tags |话题标签 | String  | 可选（多个以逗号分隔） |
|status|话题状态| String  |可选（verified/closed） |
|delete|是否删除| String  | 可选（true/false） |
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 4.4、获取话题分类配置

|接口定义|http://xxx:port/rest/topic/category/:categoryName | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 4.5、获取订单列表

|接口定义|http://xxx:port/rest/orders |||
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|可选，精确匹配，与userID二选一|
|userID|用户ID|String|可选， 如果传phone，则忽略userID|
|type|用户身份|String|type=expert，获取专家端订单，否则获取用户端订单|
|status|订单状态|String|可选，pending，confirmed，paid，toBeFinished，finished，rejected，默认不传获取全部|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 4.6、获取订单详情

|接口定义|http://xxx:port/rest/order/:o_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|返回值| 
|code|状态码|int|必选|
|info|订单详细信息|Object|必选|
|msg|错误信息|string|可选|

## 4.7、获取小纸条列表

|接口定义|http://xxx:port/rest/notes |||
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|可选，精确匹配，与userID二选一|
|userID|用户ID|String|可选， 如果传phone，则忽略userID|
|type|用户身份|String|type=expert，获取专家端列表，否则获取用户端列表|
|status|订单状态|String|可选，pending，confirmed，paid，toBeFinished，finished，rejected，默认不传获取全部|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 4.8、获取小纸条详情

|接口定义|http://xxx:port/rest/note/:note_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|返回值| 
|code|状态码|int|必选|
|info|小纸条详细信息|Object|必选|
|msg|错误信息|string|可选|




# 5、提现管理

## 5.1、获取提现记录

|接口定义|http://xxx:port/rest/user/withdraw |||
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|phone|手机号|String|可选，精确匹配，与userID二选一|
|userID|用户ID|String|可选， 如果传phone，则忽略userID|
|status|提现状态|String|可选，pending，paid，fail，默认不传获取全部|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|startAt|开始时间|String|可选，JSON string|
|endAt|截止时间|String|可选，JSON string|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 5.2、获取指定用户资金变动记录

|接口定义|http://xxx:port/rest/user/:userID/money |||
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|type|记录类型|String|可选，order、note、listen、withdraw，默认不传获取全部|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|startAt|开始时间|String|可选，JSON string|
|endAt|截止时间|String|可选，JSON string|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 5.3、标记用户提现成功、失败

|接口定义|http://xxx:port/rest/user/withdraw/:withdraw_id |||
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|status|提现状态|String|必选，paid：成功、fail：失败|
|remark|备注|String|可选，提现失败原因|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|


# 6、其他接口
## 6.1、获取用户反馈主列表

|接口定义|http://xxx:port/rest/feedback | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 6.2、获取用户反馈指定用户列表

|接口定义|http://xxx:port/rest/feedback/:userID | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 6.3、回复用户反馈

|接口定义|http://xxx:port/rest/feedback | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|u_id|被回复的用户ID|String|必选|
|content|回复内容|String|必选，仅文字|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 6.4、获取在线参数列表

|接口定义|http://xxx:port/rest/onlineConfig | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|platform|平台|String|可选，android、ios|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 6.5、添加、编辑在线参数

|接口定义|http://xxx:port/rest/onlineConfig/:config_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|key|key|String|添加时必选，不可修改|
|value|value|String|添加时必选|
|platform|平台|String|添加时必选，android、ios二选一，不可修改|
|desc|描述|String|可选|
|valid|是否启用|String|添加时不需要，编辑时可选，true、false|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 6.6、获取检测更新列表

|接口定义|http://xxx:port/rest/update | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|platform|平台|String|可选，android、ios|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

## 6.7、添加、编辑更新记录

|接口定义|http://xxx:port/rest/update/:update_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|version|版本号|String|version string|
|code|版本序号|String|数字，从1开始每个版本依次递增|
|platform|平台|String|android、ios二选一|
|url|下载链接|String|安装包url|
|desc|更新描述|String|可选|
|time|更新时间|String|可选|
|valid|是否启用|String|添加时不需要，编辑时可选，true、false|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

## 6.8、生成一个推广码

|接口定义|http://xxx:port/rest/shareCode | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|desc|描述|String|必选|
|返回值| 
|code|状态码|int|必选|
|info|推广码内容|int|必选|
|link|下载链接|String|必选|
|msg|错误信息|string|可选|


## 6.9、编辑推广码

|接口定义|http://xxx:port/rest/shareCode/:shareCode | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|请求参数|参数说明|参数类型|备注|
|desc|描述|String|必选|
|返回值| 
|code|状态码|int|必选|
|msg|错误信息|string|可选|


## 6.10、获取推广码列表

说明：返回推广码列表以及指定时间段内的推广数据。

|接口定义|http://xxx:port/rest/shareCode | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|key|关键字|String|可选，匹配desc|
|startAt|开始时间|String|可选|
|endAt|截止时间|String|可选|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|


## 6.11、获取指定推广码的推广数据

|接口定义|http://xxx:port/rest/shareCode/:shareCode/stat | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|返回值| 
|code|状态码|int|必选|
|stat|推广数据|Object||
|msg|错误信息|string|可选|


## 6.12、获取指定二维码的推广效果列表

|接口定义|http://xxx:port/rest/shareCode/:shareCode/list | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|请求参数|参数说明|参数类型|备注|
|startAt|开始时间|String|可选|
|endAt|截止时间|String|可选|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|获取类型|String|可选，new推广新用户、reg已注册用户|
|返回值| 
|code|状态码|int|必选|
|list|返回列表|List|必选|
|msg|错误信息|string|可选|

