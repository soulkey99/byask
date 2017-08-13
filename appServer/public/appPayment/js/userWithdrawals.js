/**
 * Created by hjy on 2016/1/22 0022.
 */

function setBgColorIn(obj){
    var timerId;
    document.ontouchmove = function(e){
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#3d8dcb");
}

function setBgColorOut(obj){
    $(obj).css("backgroundColor","#449de2");
}

function setNumBgColorIn(obj){
    var timerId;
    document.ontouchmove = function(e){
        window.clearInterval(timerId);
        timerId = window.setTimeout(setBgColorOut(obj), 0);
    }
    $(obj).css("backgroundColor","#d1d5da");
}

function setNumBgColorOut(obj){
    $(obj).css("backgroundColor","");
}

function setDoBgColorIn(obj){
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

function getUserInfo(){
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'pay/withdrawInfo?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900) {
            vm.userNick(data.info.name);
            vm.userName(data.info.id);
        } else {
            util.errorCodeApi(data);
        }
    },"GET");
}

function getBalance(){
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'user/money?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900) {
            vm.balance(data.money.money/100);
            $("body").css("visibility","visible");
            $("body").addClass("animated fadeIn");
        } else {
            util.errorCodeApi(data);
        }
    },"GET");
}

function getAllBalance(){
    if(parseInt(vm.balance()) > 0){
        vm.withdrawalsNum(vm.balance());
    }
}

function subWithdrawals(){
    window.location.href = "/appPayment/setWithdrawalsPwd.html?money="+vm.withdrawalsNum()*100;
}

function checkWithdrawalsNum(obj){
    obj.value = obj.value.replace(/\D/gi,'').replace(/^0/,'');
    if(obj.value > vm.balance()){
        obj.value = vm.balance();
    }
}

var viewModel = function(){
    this.userName = ko.observable("");
    this.userNick = ko.observable("");
    this.balance = ko.observable("");
    this.withdrawalsNum = ko.observable("");
    this.trueWithdrawalsNum = ko.computed(function() {
        return "实际提现:<span style='color: #449de2'>"+ (parseInt(this.withdrawalsNum())*0.9).toFixed(1) + "</span>￥&nbsp;&nbsp;平台分成:" + (parseInt(this.withdrawalsNum())*0.1).toFixed(1) + "￥";
    }, this);
};
var vm = new viewModel();
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
}else{
    util.setSessionStorage("userID",userID);
    util.setSessionStorage("authSign",authSign);
}
$(document).ready(function(){
    FastClick.prototype.onTouchEnd = function(event) {
        if (event.target.hasAttribute("type") && event.target.getAttribute("type") == "number") {
            return false;
        }
    }
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    getUserInfo();
    getBalance();
});