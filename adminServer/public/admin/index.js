/**
 * Created by hjy on 2016/8/1 0001.
 */

function tabExpertAudit(){
    var title = "专家审核管理";
    var menu = "专家审核管理";
    var href = "javascript:tabExpertAudit()";
    var url = "expertManager/expertAudit.html";
    initMenu(menu,href,title,url);
}

function tabIndexBanner(){
    var title = "首页Banner管理";
    var menu = "首页Banner管理";
    var href = "javascript:tabIndexBanner()";
    var url = "operationsManager/indexBanner.html";
    initMenu(menu,href,title,url);
}

function tabAd(){
    var title = "广告管理";
    var menu = "广告管理";
    var href = "javascript:tabAd()";
    var url = "operationsManager/ad.html";
    initMenu(menu,href,title,url);
}

function tabIndexRecommend(){
    var title = "首页推荐管理";
    var menu = "首页推荐管理";
    var href = "javascript:tabIndexRecommend()";
    var url = "operationsManager/indexRecommend.html";
    initMenu(menu,href,title,url);
}

function tabIndexClassification(){
    var title = "首页分类管理";
    var menu = "首页分类管理";
    var href = "javascript:tabIndexClassification()";
    var url = "operationsManager/indexClassification.html";
    initMenu(menu,href,title,url);
}

function tabUser(){
    var title = "用户管理";
    var menu = "用户管理";
    var href = "javascript:tabUser()";
    var url = "operationsManager/user.html";
    initMenu(menu,href,title,url);
}

function tabLog(){
    var title = "日志管理";
    var menu = "日志管理";
    var href = "javascript:tabLog()";
    var url = "operationsManager/usersLog.html";
    initMenu(menu,href,title,url);
}

function tabOrder(){
    var title = "订单管理";
    var menu = "订单管理";
    var href = "javascript:tabOrder()";
    var url = "operationsManager/order.html";
    initMenu(menu,href,title,url);
}

function tabNote(){
    var title = "小纸条管理";
    var menu = "小纸条管理";
    var href = "javascript:tabNote()";
    var url = "operationsManager/note.html";
    initMenu(menu,href,title,url);
}

function tabWithdraw(){
    var title = "提现管理";
    var menu = "提现管理";
    var href = "javascript:tabWithdraw()";
    var url = "operationsManager/withdraw.html";
    initMenu(menu,href,title,url);
}

function tabUserFeedback(){
    var title = "用户反馈管理";
    var menus = "用户反馈管理";
    var hrefs = "javascript:tabUserFeedback()";
    var url = "operationsManager/userFeedback.html";
    initMenu(menus,hrefs,title,url);
}

function tabShareCode(){
    var title = "分享码管理";
    var menus = "分享码管理";
    var hrefs = "javascript:tabShareCode()";
    var url = "operationsManager/shareCode.html";
    initMenu(menus,hrefs,title,url);
}

function tabAdmin(){
    var title = "管理员管理";
    var menus = "管理员管理";
    var hrefs = "javascript:tabAdmin()";
    var url = "systemManager/admin.html";
    initMenu(menus,hrefs,title,url);
}

function tabOnlineConfig(){
    var title = "系统管理";
    var menu = "在线参数管理"
    var href = "javascript:tabOnlineConfig()";
    var url = "systemManager/onlineConfig.html";
    initMenu(menu,href,title,url);
}

function tabUpdate(){
    var title = "系统管理";
    var menu = "更新管理"
    var href = "javascript:tabUpdate()";
    var url = "systemManager/updateRecording.html";
    initMenu(menu,href,title,url);
}

function initMenu(menu,href,title,url){
    $('#element').fadeOut(0);
    document.onkeydown = function(e){
        e = e||window.event;
        if(e.keyCode==116){
            initMenu(menus,hrefs,title,url);
            return false;
        }
    }

    $("#h2Title").text(title);
    $(".mdl-layout-title").empty();
    $(".mdl-layout-title").text(menu);
    $('main').empty();
    $('main').load(url);
    $('main').fadeIn(250);
    $("html body").scrollTop(0);
}

function loginOut(){
    util.callServerFunction({},"logout", {}, function(data){
        if(data.code == "900"){
            window.location.href = '../login.html';
        }else{
            util.errorCodeApi(data);
        }
    },"POST");
}

function initPage(){
    if(util.getSessionStorage("userType") == "super"){
        $("#expertAudit,#indexBanner,#ad,#indexBanner,#indexClassification,#indexRecommend,#user,#log,#order,#note,#withdraw,#userFeedback,#shareCode,#admin,#onlineConfig,#update").attr("style","display: -webkit-flex !important;display: -ms-flexbox !important;display: flex !important;");
    }else{
        var sections = util.getSessionStorage("sections").split(",");
        for(var i=0;i<sections.length;i++){
            $("#"+sections[i]).attr("style","display: -webkit-flex !important;display: -ms-flexbox !important;display: flex !important;");
        }
    }
    $("#userNameLeft").html("<strong>"+util.getSessionStorage("userName")+"</strong>");
    $("#rightNick").html(util.getSessionStorage("userName"));
    $("#lastLoginTime").html(util.getSessionStorage("lastLoginTime"));
}
initPage();
