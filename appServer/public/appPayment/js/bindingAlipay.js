/**
 * Created by hjy on 2016/1/20 0020.
 */

function setBgColorIn(obj) {
    var timerId;
    document.ontouchmove = function(e) {
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#3b7be5");
}

function setBgColorOut(obj) {
    $(obj).css("backgroundColor","#4289ff");
}

function setSMBtnBgc() {
    if($("#alipayPhone").val().length == 11 && vm.wait() == 60 && $("#alipayPhone").val()==vm.userPhone()){
        $(".msgButton").remove();
        $("#alipayPhone").after("<div class='msgButton' onclick='javascript:sendMsg(this)'>获取验证码</div>");
        $(".msgButton").css("backgroundColor","#449de2");
    } else if($("#alipayPhone").val().length == 11 && $("#alipayPhone").val()!=vm.userPhone()) {
        $(".msgButton").remove();
        $("#alipayPhone").after("<div class='errorMsg' data-bind='visible: isError() && alipayCode()!='''><img src='images/error.png'><span>号码不匹配</span></div>");
    } else{
        $("#alipayPhone").next().remove();
        $(".msgButton").remove();
        $("#alipayPhone").after("<div class='msgButton' onclick='javascript:void(0)'>获取验证码</div>");
        $(".msgButton").css("backgroundColor","#d9d9d9");
    }
}

function sendMsg(obj) {
    if(vm.wait() == 60 && $("#alipayPhone").val().length == 11) {
        var postObj = {};
        postObj.phone = $("#alipayPhone").val();
        util.callServerFunction({},"smscode?random="+parseInt(Math.random()*10000), postObj, function(data) {
            if(data.code == 900) {
                $(obj).css("backgroundColor", "#d9d9d9");
                $(obj).bind("click",void(0));
                $(obj).text(vm.wait() + " 秒后失效");
                var timer = setInterval(function () {
                    if(vm.wait() == 0) {
                        clearInterval(timer);
                        $(obj).css("backgroundColor", "#449de2");
                        $(obj).text("获取验证码");
                        vm.wait(60);
                    } else {
                        vm.wait(vm.wait()-1);
                        $(obj).text(vm.wait() + " 秒后失效");
                    }
                }, 1000)
            } else {
                $(obj).text("发送失败");
                util.errorCodeApi(data);
            }
        },"POST");
    }
}

function changeImg() {
    vm.isAgree(!vm.isAgree());
}

function delError() {
    vm.isError(false);
}

function getUserInfo() {
    // test: 54f3b5fec08b6f54100c1cbe  z
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},"user?random="+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900) {
            vm.userPhone(data.info.phone);
            //$("#alipayPhone").attr("placeholder","*******"+data.info.phone.substring(7,11)+"(输入注册账号的手机号)");
            $("#alipayPhone").attr("placeholder","*******"+data.info.phone.substring(7,11)+"(完善此号码)");
            $("body").css("visibility","visible");
            $("body").addClass("animated fadeIn");
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function binding() {
    var postObj = {};
    var u = navigator.userAgent;
    postObj.id = $("#alipayNumber").val();
    postObj.name = $("#alipayNick").val();
    postObj.smscode = $("#alipayCode").val();
    postObj.type = "alipay";
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},"pay/withdrawInfo?random="+parseInt(Math.random()*10000), postObj, function(data) {
        if(data.code == 900) {
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                javascript:callcall.jsCallback('bindsuccess', {});
            }
            window.location.href = "/appPayment/setTransactionPwd.html";
        }else{
            vm.isError(true);
            util.errorCodeApi(data);
        }
    },"POST");
}

function showPayAgreement(){
    //window.location.href = "../../payAgreementT.html";
    $(".payNote").removeClass("animated slideOutDown");
    $(".payNote").css("z-index","2");
    $(".payNote").css("visibility","visible");
    $(".payNote").show();
    $(".payNote").addClass("animated slideInUp");
}

function hidePayAgreement(){
    //window.location.href = "../../payAgreementT.html";
    $(".payNote").removeClass("animated slideInUp");
    $(".payNote").addClass("animated slideOutDown");
    setTimeout(function(){
            $(".payNote").css("z-index","-1");
            $(".payNote").css("visibility","hidden");
            $(".payNote").hide();
        },700
    );
}

var viewModel = function() {
    this.wait = ko.observable(60);
    this.isAgree = ko.observable(true);
    this.isError = ko.observable(false);
    this.alipayNumber = ko.observable("");
    this.alipayNick = ko.observable("");
    this.alipayPhone = ko.observable("");
    this.alipayCode = ko.observable("");
    this.userPhone = ko.observable("");
    this.changeImg = changeImg;
};
var vm = new viewModel()
var userID = util.querystring('userID')[0];
var authSign = util.querystring('authSign')[0];
//userID = "560ba4eb5a83a29c23fd142f";
//authSign = "81a326d29c9c90469421a4266ee607a7";
if(util.getSessionStorage("userID") != null && util.getSessionStorage("userID") != undefined && util.getSessionStorage("userID") != ""){
    userID = util.getSessionStorage("userID");
    authSign = util.getSessionStorage("authSign");
}
if(userID == "" || userID == undefined || userID == null){
    util.js2Phone();
}
util.setSessionStorage("userID",userID);
util.setSessionStorage("authSign",authSign);
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $("header").css("height",$(window).height()*0.15 + "px");
    $("article").css("height",$(window).height()*0.76 + "px");
    $(".subBtn").css("height",$(window).height()*0.1 + "px");
    $(".subBtn").css("lineHeight",$(window).height()*0.1 + "px");
    $("footer").css("height",$(window).height()*0.07 + "px");
    $("footer").css("lineHeight",$(window).height()*0.07 + "px");
    getUserInfo();
});