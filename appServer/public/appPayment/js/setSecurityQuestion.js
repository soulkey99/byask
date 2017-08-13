/**
 * Created by hjy on 2016/1/21 0021.
 */

function setBgColorIn(obj) {
    var timerId;
    document.ontouchmove = function(e) {
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#1c61d2");
}

function setBgColorOut(obj) {
    $(obj).css("backgroundColor","#2e76ec");
}

function subQuestions() {
    var postObj = {};
    var u = navigator.userAgent;
    postObj.answer1 = $("#question1").val();
    postObj.answer2 = $("#question2").val();
    postObj.answer3 = $("#question3").val();
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'pay/question?random='+parseInt(Math.random()*10000), postObj, function(data) {
        if(data.code == 900) {
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                javascript:callcall.jsCallback('setquestionsuccess', {});
            }
            window.location.href = "/appPayment/finishBind.html";
        } else {
            util.errorCodeApi(data);
        }
    },"POST");
}

var viewModel = function() {
    this.question1 = ko.observable("");
    this.question2 = ko.observable("");
    this.question3 = ko.observable("");
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
$(document).ready(function() {
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $(".main").css("height",$(window).height()*0.92 + "px");
    $(".subBtn").css("height",$(window).height()*0.07 + "px");
    $(".subBtn").css("lineHeight",$(window).height()*0.07 + "px");
    $("body").css("visibility","visible");
    $("body").addClass("animated fadeIn");
});