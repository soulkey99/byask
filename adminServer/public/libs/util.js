var util = function()
{
};

/**
 * 获取当前页面的URL参数
 */
util.getUrlParameter = function(paramName)
{
    var paramValue = "";
    var isFound = false;
    if ((document.location.search.indexOf("?") == 0) && (document.location.search.indexOf("=") > 1))
    {
        var arrSource = unescape(document.location.search).substring(1, document.location.search.length).split("&");
        var i = 0;
        while (i < arrSource.length && !isFound)
        {
            if (arrSource[i].indexOf("=") > 0)
            {
                if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase())
                {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
};

/**
 * 获取URL中的参数解决中文乱码问题
 */

util.getQueryString = function(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}

/**
 * 获取Cookie值
 */
util.getCookieValue = function(key)
{
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++)
    {
        var arr = arrCookie[i].split("=");
        if (arr[0] == key)
            return arr[1];
    }
    return "";
};

/**
 * 增加html5本地存储
 */
util.setSessionStorage = function(key, value)
{
    if (window.sessionStorage)
    {
        window.sessionStorage.setItem(key, value);
        return true;
    }
    else
    {
        return false;
    }
};

/**
 * 获取html5本地存储
 */
util.getSessionStorage = function(key)
{
    if (window.sessionStorage)
    {
        return window.sessionStorage.getItem(key);
    }
    else
    {
        return null;
    }
};

/**
 * 删除html5本地存储
 */
util.removeSessionStorage = function(key)
{
    if (window.sessionStorage)
    {
        window.sessionStorage.removeItem(key);
        return true;
    }
    else
    {
        return false;
    }
};

/**
 * 获取querystring
 * */
util.querystring = function(key) {
    var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
    var r=[], m;
    while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
    return r;
};

/**
 * 判断系统是否ios
 * */

util.isIos = function (){
    var ua = navigator.userAgent.toLowerCase();
    return (ua.match(/iPhone/i) == "iphone");
};


/**
 * 判断是否微信内部webview
 * */
util.isWeixin = function(){
    var ua = navigator.userAgent.toLowerCase();
    return (ua.match(/MicroMessenger/i) == "micromessenger");
};


/**
 * 判断字符串是否手机号
 * */
util.isMobile = function(str){
    return (/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/.test(str));
};

//unix时间戳转字符串
util.convertTime2Str = function(t){
    if(t == "" || t == undefined || t == "undefined"){
        return "暂无记录";
    }else{
        var ts = new Date(t);
        var year = ts.getFullYear().toString();
        var month = (ts.getMonth() + 1).toString();
        month = month.length < 2 ? '0' + month : month;
        var date = ts.getDate().toString();
        date = date.length < 2 ? '0' + date : date;
        var dateStr = year + '-' + month + '-' + date;
        var hour = ts.getHours().toString();
        hour = hour.length < 2 ? '0' + hour : hour;
        var min = ts.getMinutes().toString();
        min = min.length < 2 ? '0' + min : min;
        var sec = ts.getSeconds().toString();
        sec = sec.length < 2 ? '0' + sec : sec;
        var timeStr = hour + ':' + min + ':' + sec;
        return dateStr + ' ' + timeStr;
    }
};

/**
 * 异步调用服务器接口
 */
// util.urlConfig = "https://test.soulkey99.com:9070/rest/";
util.urlConfig = "/rest/";
util.serviceConfig = "测试服";
util.callServerFunction = function(header ,funcName, postData, callback, method)
{
    var u = navigator.userAgent, platform = "";
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        platform = "android";
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        platform = "ios";
    }

    var networkError =
    {
        "code" : -1000,
        "data" :
        {
            "result" : "网络错误。"
        }
    };
    if (!method)
    {
        method = 'POST';
    }

    /* 服务器暂未添加会话，为了记录日志，暂时由客户端传递用户名，后续改为服务器从Session获取 */
    if(!postData)
    {
        postData = {};
    }
    /* 增加checkflag，服务器校验请求完整性 */
    postData['checkflag'] = true;

    $.ajax(
    {
        type : method,
        async : true,
        url : util.urlConfig + funcName,
        //url : 'http://test.soulkey99.com:8067/api?m=' + funcName,  //api?m=   http://test.soulkey99.com:8067/api?m=
        dataType : 'json',
        data : postData,
        beforeSend: function(request) {
            request.setRequestHeader("platform", platform);
            if(header != {}){
                request.setRequestHeader("auth", header.auth);
            }
        },
        /* 成功时直接返回数据 */
        success : function(data, textStatus, jqXHR)
        {
            callback(data);
        },
        /* 失败时返回默认错误 */
        error : function(jqXHR, textStatus, errorThrown)
        {
            callback(networkError);
        }
    });
};

/**
 * 检查用户会话状态，如果会话失效则跳转到登录页（暂时仅检查用户名）
 */
util.checkUserSession = function()
{
    var userId = util.getSessionStorage('userId');
    if (!userId)
    {
        alert("请先登录！");
        window.top.location = "../login.html";
        return false;
    }
    return true;
};

/**
 * 弹出提示对话框
 * @param {string} msg 提示信息
 * @param {function} 回调函数（alert时'确认'回调，confirm时'是'回调）
 * @param {string} type 类型（默认'alert'，可选'confirm'）
 * @param {function} 回调函数（confirm时'否'回调）
 */
util.showDialog = function(msg, func, type, nfunc)
{
    /* 如果顶级窗口有util，则由顶级窗口弹出 */
    var win = window;
    if (window.top && window.top.util)
    {
        win = window.top;
    }
    /* 如果不存在#dialog-message则创建 */
    if (win.$('#dialog-message').length > 0)
    {
        var html = '#dialog-message';
        win.$('#dialog-message').html(msg);
    }
    else
    {
        var html = '<div class="dialog" id="dialog-message">' + msg + '</div>';
    }

    if (type == 'confirm')
    {
        win.$(html).dialog(
        {
            resizable : false,
            modal : true,
            show :
            {
                effect : 'fade',
                duration : 300
            },
            title : "确认",
            open : function(event, ui)
            {
                win.$(".ui-dialog-titlebar-close").hide();
            },
            buttons :
            {
                "是" : function()
                {
                    var dlg = top.$(this).dialog("close");
                    func && func.call();
                },
                "否" : function()
                {
                    var dlg = top.$(this).dialog("close");
                    nfunc && nfunc.call();
                }
            }
        });
    }
    else
    {
        win.$(html).dialog(
        {
            resizable : false,
            modal : true,
            show :
            {
                effect : 'fade',
                duration : 300
            },
            title : "提示",
            open : function(event, ui)
            {
                win.$(".ui-dialog-titlebar-close").hide();
            },
            buttons :
            {
                "确定" : function()
                {
                    top.$(this).dialog("close");
                    func && func.call();
                }
            }
        });
    }
};

/**
 * 显示顶层页面的等待画面
 * @param {Object} msg
 */
util.showLoading = function(msg)
{
    var win = window;
    if (window.top && window.top.showLoading)
    {
        window.top.showLoading(msg);
    }
    else
    {
        window.showLoading(msg);
    }
};

/**
 * 隐藏顶层页面的等待画面
 */
util.hideLoading = function()
{
    var win = window;
    if (window.top && window.top.hideLoading)
    {
        window.top.hideLoading();
    }
    else
    {
        window.hideLoading();
    }
};

/**
 * 将textarea的内容中的回车转换为<br/>
 * 保证入库的数据无换行。
 */
util.enterToBr = function(data)
{
    return data.replace(/\n/gi, '<br\/>');
};

/**
 * 将textarea的内容中的<br/>转换为回车
 * 保证入库的数据无换行。
 */
util.brToEnter = function(data)
{
    return data.replace(/<br\/>/gi, '\n');
};

/**
 * 用"0"进行满位填充
 */
util.fillZero = function(num, len)
{
    num = '0000000000' + num;
    return num.substring(num.length - len);
};

/**
 * 获取时间戳
 * @param {Object} separator 1：正常分隔YYYY-MM-DD HH:mm:ss；其它：无分隔
 */
util.getTimestamp = function(separator)
{
    var time = new Date();
    var timeStr = '';
    if (separator == 1)
    {
        timeStr += time.getFullYear();
        timeStr += '-' + util.fillZero(time.getMonth() + 1, 2);
        timeStr += '-' + util.fillZero(time.getDate(), 2);
        timeStr += ' ' + util.fillZero(time.getHours(), 2);
        timeStr += ':' + util.fillZero(time.getMinutes(), 2);
        timeStr += ':' + util.fillZero(time.getSeconds(), 2);
    }
    else
    {
        timeStr += time.getFullYear();
        timeStr += util.fillZero(time.getMonth() + 1, 2);
        timeStr += util.fillZero(time.getDate(), 2);
        timeStr += util.fillZero(time.getHours(), 2);
        timeStr += util.fillZero(time.getMinutes(), 2);
        timeStr += util.fillZero(time.getSeconds(), 2);
    }
    return timeStr;
};

//type=success/info/warning/error
util.toast = function(str, type, title){
    if(toastr){
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "200",
            "hideDuration": "500",
            "timeOut": "3000",
            "extendedTimeOut": "500",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }
    if(!type){
        type = 'info';
    }
    toastr[type](str, title);
};

/*
    amr文件转mp3文件
 */
util.amrToMp3Ajax = function(amrUrl,obj){
    $.ajax({
        type: "get",
        cache : false,
        async: false,
        url: "http://123.57.16.157:8082/AmrToMp3ServletNew",
        data: {url:amrUrl},
        dataType: "jsonp",
        jsonp: "callbackparam",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        jsonpCallback:"success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function(data){
            $(obj).html("<audio src='"+data[0].mp3Url+"' controls='controls'></audio>");
        },
        error: function(){
            alert('fail');
        }
    });
}

/*
    获取两个时间间隔
 */
util.getBetweenTime = function(startTime,endTime){
    var date1 = new Date(startTime);  //开始时间
    var date2 = new Date(endTime);    //结束时间
    var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数
    var betweenTime = "";
    //计算相差的年数
    var years = Math.floor(date3 / (12 * 30 * 24 * 3600 * 1000));
    //计算相差的月数
    var leave = date3 % (12 * 30 * 24 * 3600 * 1000);
    var months = Math.floor(leave / (30 * 24 * 3600 * 1000));
    //计算出相差天数
    var leave0 = leave % (30 * 24 * 3600 * 1000);
    var days = Math.floor(leave0 / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = leave0 % (24 * 3600 * 1000);     //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);         //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);       //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    if(years!=0){
        betweenTime += years+"年";
    }
    if(months!=0){
        betweenTime += months+"月";
    }
    if(days!=0){
        betweenTime += days+"天";
    }
    if(hours!=0){
        betweenTime += hours+"小时";
    }
    if(minutes!=0){
        betweenTime += minutes+"分";
    }
    if(seconds!=0){
        betweenTime += seconds+"秒";
    }
    return betweenTime;
}

//错误返回代码提示
util.errorCodeApi = function(errorData){
    switch(errorData.code){
        case 903: //token invalid
            $.confirm({
                icon: 'icon icon-warning',
                title: '提示信息',
                content: errorData.message,
                confirmButton: '重新登陆',
                cancelButton: '取消',
                confirm: function(){
                    window.location.href = "/login.html";
                },
                theme: "material",
                columnClass: "mdl-cell mdl-cell--4-col mdl-cell--4-offset"
            })
            break;
        default:
            alert(errorData.code + "-" + errorData.msg);
            break;
    }
}

//密码加密
util.sha256 = function(str){
    function rotateRight(n,x) {
        return ((x >>> n) | (x << (32 - n)));
    }
    function choice(x,y,z) {
        return ((x & y) ^ (~x & z));
    }
    function majority(x,y,z) {
        return ((x & y) ^ (x & z) ^ (y & z));
    }
    function sha256_Sigma0(x) {
        return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
    }
    function sha256_Sigma1(x) {
        return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
    }
    function sha256_sigma0(x) {
        return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
    }
    function sha256_sigma1(x) {
        return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
    }
    function sha256_expand(W, j) {
        return (W[j&0x0f] += sha256_sigma1(W[(j+14)&0x0f]) + W[(j+9)&0x0f] +
            sha256_sigma0(W[(j+1)&0x0f]));
    }

    /* Hash constant words K: */
    var K256 = new Array(
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    );

    /* global arrays */
    var ihash, count, buffer;
    var sha256_hex_digits = "0123456789abcdef";

    /* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters:
     overflow) */
    function safe_add(x, y)
    {
        var lsw = (x & 0xffff) + (y & 0xffff);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xffff);
    }

    /* Initialise the SHA256 computation */
    function sha256_init() {
        ihash = new Array(8);
        count = new Array(2);
        buffer = new Array(64);
        count[0] = count[1] = 0;
        ihash[0] = 0x6a09e667;
        ihash[1] = 0xbb67ae85;
        ihash[2] = 0x3c6ef372;
        ihash[3] = 0xa54ff53a;
        ihash[4] = 0x510e527f;
        ihash[5] = 0x9b05688c;
        ihash[6] = 0x1f83d9ab;
        ihash[7] = 0x5be0cd19;
    }

    /* Transform a 512-bit message block */
    function sha256_transform() {
        var a, b, c, d, e, f, g, h, T1, T2;
        var W = new Array(16);

        /* Initialize registers with the previous intermediate value */
        a = ihash[0];
        b = ihash[1];
        c = ihash[2];
        d = ihash[3];
        e = ihash[4];
        f = ihash[5];
        g = ihash[6];
        h = ihash[7];

        /* make 32-bit words */
        for(var i=0; i<16; i++)
            W[i] = ((buffer[(i<<2)+3]) | (buffer[(i<<2)+2] << 8) | (buffer[(i<<2)+1]
            << 16) | (buffer[i<<2] << 24));

        for(var j=0; j<64; j++) {
            T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
            if(j < 16) T1 += W[j];
            else T1 += sha256_expand(W, j);
            T2 = sha256_Sigma0(a) + majority(a, b, c);
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }

        /* Compute the current intermediate hash value */
        ihash[0] += a;
        ihash[1] += b;
        ihash[2] += c;
        ihash[3] += d;
        ihash[4] += e;
        ihash[5] += f;
        ihash[6] += g;
        ihash[7] += h;
    }

    /* Read the next chunk of data and update the SHA256 computation */
    function sha256_update(data, inputLen) {
        var i, index, curpos = 0;
        /* Compute number of bytes mod 64 */
        index = ((count[0] >> 3) & 0x3f);
        var remainder = (inputLen & 0x3f);

        /* Update number of bits */
        if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
        count[1] += (inputLen >> 29);

        /* Transform as many times as possible */
        for(i=0; i+63<inputLen; i+=64) {
            for(var j=index; j<64; j++)
                buffer[j] = data.charCodeAt(curpos++);
            sha256_transform();
            index = 0;
        }

        /* Buffer remaining input */
        for(var j=0; j<remainder; j++)
            buffer[j] = data.charCodeAt(curpos++);
    }

    /* Finish the computation by operations such as padding */
    function sha256_final() {
        var index = ((count[0] >> 3) & 0x3f);
        buffer[index++] = 0x80;
        if(index <= 56) {
            for(var i=index; i<56; i++)
                buffer[i] = 0;
        } else {
            for(var i=index; i<64; i++)
                buffer[i] = 0;
            sha256_transform();
            for(var i=0; i<56; i++)
                buffer[i] = 0;
        }
        buffer[56] = (count[1] >>> 24) & 0xff;
        buffer[57] = (count[1] >>> 16) & 0xff;
        buffer[58] = (count[1] >>> 8) & 0xff;
        buffer[59] = count[1] & 0xff;
        buffer[60] = (count[0] >>> 24) & 0xff;
        buffer[61] = (count[0] >>> 16) & 0xff;
        buffer[62] = (count[0] >>> 8) & 0xff;
        buffer[63] = count[0] & 0xff;
        sha256_transform();
    }

    /* Split the internal hash values into an array of bytes */
    function sha256_encode_bytes() {
        var j=0;
        var output = new Array(32);
        for(var i=0; i<8; i++) {
            output[j++] = ((ihash[i] >>> 24) & 0xff);
            output[j++] = ((ihash[i] >>> 16) & 0xff);
            output[j++] = ((ihash[i] >>> 8) & 0xff);
            output[j++] = (ihash[i] & 0xff);
        }
        return output;
    }

    /* Get the internal hash as a hex string */
    function sha256_encode_hex() {
        var output = new String();
        for(var i=0; i<8; i++) {
            for(var j=28; j>=0; j-=4)
                output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
        }
        return output;
    }

    /* Main function: returns a hex string representing the SHA256 value of the
     given data */
    function sha256_digest(data) {
        sha256_init();
        sha256_update(data, data.length);
        sha256_final();
        return sha256_encode_hex();
    }

    return sha256_digest(str).toUpperCase()
}

//弹出层
util.alert = function(title,content,size){
    var columnClass = "";
    if(size == "l"){
        columnClass = "large-12"
    }else if(size == "m"){
        columnClass = "large-8 large-offset-2"
    }else if(size == "s"){
        columnClass = "large-6 large-offset-3"
    }
    columnClass = "large-4 medium-6 small-10 large-offset-4 medium-offset-3 small-offset-1";
    var alert = $.alert({
        title: title,
        content: content,
        columnClass: columnClass +" dialogContentClass",
        theme: "hololight",
        confirmButton: "关闭",
        confirmButtonClass: "dialogButtonClass"
    })
    return alert;
}

//对话框
util.dialog = function(title,content,size){
    var columnClass = "";
    if(size == "l"){
        columnClass = "large-12"
    }else if(size == "m"){
        columnClass = "large-8 large-offset-2"
    }else if(size == "s"){
        columnClass = "large-6 large-offset-3"
    }
    columnClass = "large-4 medium-6 small-10 large-offset-4 medium-offset-3 small-offset-1";
    var dialog = $.dialog({
        title: title,
        content: content,
        columnClass: columnClass + " dialogContentClass",
        theme: "hololight"
    })
    return dialog;
}

//确认框
util.confirm = function(title,content,confirmFunction,size){
    var columnClass = "";
    if(size == "l"){
        columnClass = "large-12"
    }else if(size == "m"){
        columnClass = "large-8 large-offset-2"
    }else if(size == "s"){
        columnClass = "large-6 large-offset-3"
    }
    columnClass = "large-4 medium-6 small-10 large-offset-4 medium-offset-3 small-offset-1";
    var confirm = $.confirm({
        title: title,
        content: content,
        columnClass: columnClass + " dialogContentClass",
        theme: "hololight",
        confirmButton: '确定',
        cancelButton: '取消',
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: 'confirmButtonClass',
        confirm: confirmFunction
    })
    return confirm;
}

//app端调用的设置登录状态接口
util.setLoginSession = function(userID,authSign){
    window.sessionStorage.setItem("userID", userID);
    window.sessionStorage.setItem("authSign", authSign);
    window.location.href = window.location.href;
}

//调用app端登陆页面
util.js2Phone = function(){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        javascript:callcall.jsCallback('signin', {});
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.location = "/login";
        //window.href = "/login"
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        alert("winphone手机");
    } else if(u.indexOf('Windows') > -1){
        window.location.href = "about:blank"; //Windows
    } else if(u.indexOf('Macintosh') > -1){
        window.location.href = "about:blank"; //Mac OS
    }
}

//将dataURL转换
util.dataURLtoBlob = function(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//根据邮箱地址自动跳转到对应邮箱登陆页
var emailHash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.com': 'http://www.foxmail.com',
    'outlook.com': 'http://www.outlook.com'
}
util.url2Email = function(email){
    var _mail = email.split('@')[1];    //获取邮箱域
    for (var j in emailHash){
        if(j == _mail){
            return emailHash[_mail];    //替换登陆链接
        }
    }
    return "www.baidu.com";
}

//验证手机号码
util.checkMobile = function(phone){
    var regu =/^[1][0-9][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(phone)) {
        return true;
    }else{
        return false;
    }
}

//验证邮箱
util.checkEmail = function(strEmail) {
    var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if( emailReg.test(strEmail) ){
        return true;
    }else{
        return false;
    }
}

//验证邮编
util.checkPostCode = function(phone){
    var regu =/^[0-9]{6}$/;
    var re = new RegExp(regu);
    if (re.test(phone)) {
        return true;
    }else{
        return false;
    }
}

//修改文件路径
util.changeUrl = function(oldUrl){
    var host = window.location.host;
    if(oldUrl.indexOf("http")<0){
        return "http://"+host.substring(0,host.lastIndexOf(":"))+":8062/"+oldUrl;
    }else{
        return oldUrl;
    }
}

//旋转图片
util.rotateImg = function(pid, direction){
    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    var img = document.getElementById(pid);
    if (img == null)return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;
    var step = img.getAttribute('step');
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    img.setAttribute('step', step);
    var canvas = document.getElementById('pic_' + pid);
    if (canvas == null) {
        img.style.display = 'none';
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'pic_' + pid);
        img.parentNode.appendChild(canvas);
    }
    //旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
    $("#pic_testImg").css({"width":"100%","height":"auto"});
}

//点击input显示时间选择器
util.showDateTimePicker = function(id){
    $('#'+id).datetimepicker("show");
}

//清空输入框
util.removeInputValue = function(id){
    $('#'+id).val("");
}

//初始化时间日期选择器
util.initDateTimePicker = function(inputId,option){
    var defaultOptin = {
        format: "YYYY/MM/DD HH:mm:ss",
        showClear: true,
        showClose: true,
        showTodayButton: true,
        tooltips: {
            today: '选择今日',
            clear: '清除',
            close: '关闭',
            selectMonth: '选择月份',
            prevMonth: '上一月',
            nextMonth: '下一月',
            selectYear: '选择年份',
            prevYear: '上一年',
            nextYear: '下一年',
            selectTime: '选择时间'
        },
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
        }
    };
    $('#'+inputId).datetimepicker($.extend(defaultOptin,option));
}