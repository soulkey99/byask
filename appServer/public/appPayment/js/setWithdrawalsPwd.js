/**
 * Created by hjy on 2016/1/26 0026.
 */

function enterPwd(number){
    $("#pwd").removeClass("animated shake");
    var timeOut;
    var u = navigator.userAgent;
    if(vm.pwd().length < 6){
        vm.pwd.push(number);
        if(vm.pwd().length >= 2){
            $("div[name='pwdTextDiv']:eq("+(vm.pwd().length-2)+")").empty();
            $("div[name='pwdTextDiv']:eq("+(vm.pwd().length-2)+")").append("<div class='pwdTu'></div>");
        }
        var pwdDiv = $("div[name='pwdTextDiv']:eq("+(vm.pwd().length-1)+")");
        pwdDiv.removeClass();
        pwdDiv.addClass("pwdTextDivIn");
        pwdDiv.append("<div class='pwdText'>"+ number +"</div>");
        timeOut = setTimeout(function () {
            if (vm.pwd().length < 6 && vm.pwd().length >=1) {
                pwdDiv.empty();
                pwdDiv.append("<div class='pwdTu'></div>");
            }
        }, 300);
    }
    if(vm.pwd().length == 6){
        var postObj = {};
        postObj.amount = util.querystring("money")[0];
        postObj.passwd = util.sha256(vm.pwd().join(""));
        util.callServerFunction({auth: window.btoa("userID="+util.getSessionStorage("userID")+"&authSign="+util.getSessionStorage("authSign"))},'pay/withdraw?random='+parseInt(Math.random()*10000), postObj, function(data) {
            if(data.code == 900) {
                if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                    javascript:callcall.jsCallback('withdrawsuccess', {});
                }
                window.location.href = "/appPayment/userBill.html?moneyId=" + data.money_id + "&money=" + util.querystring("money")[0];
            } else if(data.code == 898) {
                clearTimeout(timeOut);
                $("#pwd").addClass("animated shake");
                vm.pwd([])
                for(var i=0;i<6;i++){
                    $("div[name='pwdTextDiv']:eq("+i+")").removeClass();
                    $("div[name='pwdTextDiv']:eq("+i+")").addClass("pwdTextDivOut");
                    $("div[name='pwdTextDiv']:eq("+i+")").empty();
                }
            } else {
                util.setSessionStorage("message",data.msg);
                window.location.href = "/appPayment/userWithdrawalsError.html";
            }
        },"POST");
    }
}

function removePwd(){
    if(vm.pwd().length >= 1){
        var pwdDiv = $("div[name='pwdTextDiv']:eq(" + (vm.pwd().length - 1) + ")");
        pwdDiv.removeClass();
        pwdDiv.addClass("pwdTextDivOut");
        pwdDiv.empty();
        vm.pwd.shift();
    }
}

function setNumBgColorIn(obj,num){
    var timerId;
    document.ontouchmove = function(e){
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#d1d5da");
    enterPwd(num);
}

function setNumBgColorOut(obj){
    $(obj).css("backgroundColor","");
}

function setDoBgColorIn(obj){
    removePwd();
    var timerId;
    document.ontouchmove = function(e){
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#ffffff");
    if($(obj).text() != "."){
        $(obj).find("img").attr("src","images/remIn.png");
    }
}

function setDoBgColorOut(obj){
    $(obj).css("backgroundColor","#d1d5da");
    if($(obj).text() != "."){
        $(obj).find("img").attr("src","images/remOut.png");
    }
}

var viewModel = function(){
    this.pwd = ko.observableArray();
};
var vm = new viewModel();
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $("body").css("visibility","visible");
    $("body").addClass("animated fadeIn");
    $(".pwdNum").addClass("animated slideInUp");
});