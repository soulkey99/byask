/**
 * Created by hjy on 2016/1/21 0021.
 */

function enterPwd(number) {
    $("#pwd").removeClass("animated shake");
    var timeOut;
    var u = navigator.userAgent;
    if (vm.pwd1().length < 6) {
        vm.pwd1.push(number);
        if (vm.pwd1().length >= 2) {
            $("div[name='pwdTextDiv']:eq(" + (vm.pwd1().length - 2) + ")").empty();
            $("div[name='pwdTextDiv']:eq(" + (vm.pwd1().length - 2) + ")").append("<div class='pwdTu'></div>");
        }
        var pwdDiv = $("div[name='pwdTextDiv']:eq(" + (vm.pwd1().length - 1) + ")");
        pwdDiv.removeClass();
        pwdDiv.addClass("pwdTextDivIn");
        pwdDiv.append("<div class='pwdText'>" + number + "</div>");
        timeOut = setTimeout(function () {
            if (vm.pwd1().length < 6 && vm.pwd1().length >= 1) {
                pwdDiv.empty();
                pwdDiv.append("<div class='pwdTu'></div>");
            }
        }, 300);
    }
    if (vm.pwd1().length == 6 && vm.pwd2().length <= 0) {
        clearTimeout(timeOut);
        $(".pwdTitleB").text("请再次输入6位交易密码");
        vm.pwd2(vm.pwd1());
        vm.pwd1([]);
        for (var i = 0; i < 6; i++) {
            $("div[name='pwdTextDiv']:eq(" + i + ")").removeClass();
            $("div[name='pwdTextDiv']:eq(" + i + ")").addClass("pwdTextDivOut");
            $("div[name='pwdTextDiv']:eq(" + i + ")").empty();
        }
    }
    if (vm.pwd1().length == 6 && vm.pwd1().length == 6) {
        if (vm.pwd1().join("") != vm.pwd2().join("")) {
            clearTimeout(timeOut);
            $("#pwd").addClass("animated shake");
            $(".pwdTitleB").text("请设置6位交易密码");
            vm.pwd1([]);
            vm.pwd2([]);
            for (var i = 0; i < 6; i++) {
                $("div[name='pwdTextDiv']:eq(" + i + ")").removeClass();
                $("div[name='pwdTextDiv']:eq(" + i + ")").addClass("pwdTextDivOut");
                $("div[name='pwdTextDiv']:eq(" + i + ")").empty();
            }
        } else {
            var postObj = {};
            postObj.passwd = util.sha256(vm.pwd1().join(""));
            util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'pay/passwd?random=' + parseInt(Math.random() * 10000), postObj, function (data) {
                if (data.code == 900) {
                    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                        javascript:callcall.jsCallback('setpwdsuccess', {});
                    }
                    window.location.href = "/appPayment/setSecurityQuestion.html";
                } else {
                    util.errorCodeApi(data);
                }
            },"POST");
        }
    }
}

function removePwd(){
    if(vm.pwd1().length >= 1) {
        var pwdDiv = $("div[name='pwdTextDiv']:eq(" + (vm.pwd1().length - 1) + ")");
        pwdDiv.removeClass();
        pwdDiv.addClass("pwdTextDivOut");
        pwdDiv.empty();
        vm.pwd1.shift();
    }
}

function setNumBgColorIn(obj){
    var timerId;
    document.ontouchmove = function(e){
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#d1d5da");
}

function setNumBgColorOut(obj,num){
    enterPwd(num);
    $(obj).css("backgroundColor","");
}

function setDoBgColorIn(obj){
    var timerId;
    document.ontouchmove = function(e){
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#ffffff");
    if($(obj).text() != ".") {
        $(obj).find("img").attr("src","images/remIn.png");
    }
}

function setDoBgColorOut(obj){
    removePwd();
    $(obj).css("backgroundColor","#d1d5da");
    if($(obj).text() != ".") {
        $(obj).find("img").attr("src","images/remOut.png");
    }
}

var viewModel = function(){
    this.pwd1 = ko.observableArray();
    this.pwd2 = ko.observableArray();
    this.isShowPwd = ko.observable(false);
};
var userID = util.querystring('userID')[0];
var authSign = util.querystring('authSign')[0];
if(userID != "" && userID != undefined && userID != "undefined"){
    util.setSessionStorage("userID",userID);
    util.setSessionStorage("authSign",authSign);
}else{
    userID = util.getSessionStorage("userID");
    authSign = util.getSessionStorage("authSign");
}
var vm = new viewModel();
$("header").css("height",$(window).height()*0.15 + "px");
$("article").css("height",$(window).height()*0.76 + "px");
$("footer").css("height",$(window).height()*0.09 + "px");
$(".bindBtnText").css("height",$(window).height()*0.09 + "px");
$(".bindBtnText").css("lineHeight",$(window).height()*0.09 + "px");
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $("body").css("visibility","visible");
    $("body").addClass("animated fadeIn");
    $(".pwdNum").addClass("animated slideInUp");
});