# 1、文件上传功能
说明：应用中所有涉及到文件上传的用途，都需要先调用该接口，将文件上传到服务端获取url，文件上传采用multipart/form-data方式，上传之后服务端会为文件生成一个随机的文件名，拼成文件路径返回给客户端。如果客户端有特殊需求，可以手动指定文件名path字段，如果客户端已经登陆，那么可以上传用户ID到服务端做记录log使用。vendor字段指定上传文件的存储方式，分为三种，如果不指定，那么默认保存文件至阿里云oss，如果vendor=qn，那么保存文件至七牛云存储，如果指定vendor=local，那么将文件保存只服务器本身磁盘上，对于vendor=local的情形下，如果指定的path对应文件已存在，那么服务端会返回错误，用户可以指定overwrite=true来强制覆盖已存在的文件。

|接口定义| http://xxx:port/upload | | |
|----|----|----|----|
|请求方式| POST | | |
|需要auth| 否| | |
|参数|说明|参数类型|备注|
|name="upload"|要上传的文件内容| byte | 必选 |
|name="path"| 指定路径 | string | 可选 |
|name="userID"| 用户ID | string | 可选 |
|name="vendor"| 指定文件存放方式 | string | 可选 |
|name="overwrite"| 是否覆盖已有文件 | string | 可选 |
|返回值|
|code |错误码 | Int|
|filePath| 返回文件路径| String|
|msg|错误信息|string|

