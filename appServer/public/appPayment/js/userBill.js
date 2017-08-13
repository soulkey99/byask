/**
 * Created by hjy on 2016/1/22 0022.
 */

function getBillInfo(){
    var postObj = {};
    postObj.userID = userID;
    postObj.authSign = authSign;
    postObj.money_id = util.querystring("moneyId")[0];
    util.callServerFunction('getMoneyOrderDetail&random='+parseInt(Math.random()*10000), postObj, function(data) {
        if(data.statusCode == 900) {
            if(parseInt(data.detail.amount)<0){
                vm.withdrawalsMoney(data.detail.amount*-1/100);
            }else{
                vm.withdrawalsMoney(data.detail.amount/100);
            }
            var titleText = "",payState = "";
            if(data.detail.type == "withdraw"){
                titleText = "提现";
                if(data.detail.status == "pending"){
                    payState = "提现中...";
                }else if(data.detail.status == "paid"){
                    payState = "提现成功";
                }else if(data.detail.status == "fail"){
                    payState = "提现失败";
                }
            }else if(data.detail.type == "charge"){
                titleText = "充值";
                if(data.detail.status == "pending"){
                    payState = "充值中...";
                }else if(data.detail.status == "paid"){
                    payState = "充值成功";
                }else if(data.detail.status == "fail"){
                    payState = "充值失败";
                }
            }else if(data.detail.type == "rewardTeacher"){
                titleText = "来自" + data.detail.userNick + "的打赏";
                if(data.detail.status == "pending"){
                    payState = "打赏中...";
                }else if(data.detail.status == "paid"){
                    payState = "打赏成功";
                }else if(data.detail.status == "fail"){
                    payState = "打赏失败";
                }
            }else if(data.detail.type == "seniorOrder"){
                titleText = "付费订单";
                if(data.detail.status == "pending"){
                    payState = "付费中...";
                }else if(data.detail.status == "paid"){
                    payState = "付费成功";
                }else if(data.detail.status == "fail"){
                    payState = "付费失败";
                }
            }
            vm.titleText(titleText);
            vm.payState(payState);
            vm.billId(data.detail.money_id);
            vm.payType(data.detail.channel);
            vm.alipayId(data.detail.charge.transaction_no);
            vm.billTime(util.convertTime2Str(data.detail.createTime));
            vm.billState(data.detail.status);
            vm.type(data.detail.type);
            vm.userNick(data.detail.userNick);
            $("body").css("visibility","visible");
            $("body").addClass("animated fadeIn");
        }else{
            util.errorCodeAlert(data.statusCode);
        }
    });
}

var viewModel = function(){
    this.withdrawalsMoney = ko.observable(util.querystring("money")[0]/100);
    this.billId = ko.observable("");
    this.payType = ko.observable("");
    this.alipayId = ko.observable("");
    this.billTime = ko.observable("");
    this.billState = ko.observable("pending");
    this.type = ko.observable("");
    this.userNick = ko.observable("");
    this.titleText = ko.observable("提现金额");
    this.payState = ko.observable("进行中...");
};
var userID="",authSign="";
if(util.getSessionStorage("userID")=="" || util.getSessionStorage("userID")==undefined){
    userID = util.querystring("userID")[0];
    authSign = util.querystring("authSign")[0];
}else{
    userID = util.getSessionStorage("userID");
    authSign = util.getSessionStorage("authSign");
}
var vm = new viewModel()
$(document).ready(function(){
    ko.applyBindings(vm);
    //getBillInfo();
    $("body").css("visibility","visible");
    $("body").addClass("animated fadeIn");
});