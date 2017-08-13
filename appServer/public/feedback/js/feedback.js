/**
 * Created by hjy on 2016/7/23 0023.
 */

function changeBgc(obj,color){
    $(obj).css("backgroundColor",color);
}

function subFeedback(){
    vm.checkSwitch(true);
    if(vm.fdText() == ""){
        location.href = "#fdTextDiv";
    }else if(vm.fdMail() == ""){
        location.href = "#fdMailDiv";
    }else{
        var postObj = {
            title: vm.name(),
            description: vm.introduction(),
            category: vm.category(),
            price: parseInt(vm.price())*100,
            duration: vm.time()
        };
        util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'topic?random='+parseInt(Math.random()*10000), postObj, function(data) {
            if(data.code == 900){
                if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                    javascript:callcall.jsCallback('postedTopicSuccess', JSON.stringify({}));
                } else if (u.indexOf('iPhone') > -1) {//苹果手机
                    window.location = "/postedTopicSuccess";
                }
            }else{
                util.errorCodeApi(data);
            }
        },"POST");
    }
}

var viewModel = function() {
    this.fdText = ko.observable("");
    this.fdMail = ko.observable("");
    this.checkSwitch = ko.observable(false);
};
var vm = new viewModel()
    ,u = navigator.userAgent
    ,userID = util.getQueryString("userID")
    ,authSign = util.getQueryString("authSign");
//userID = "560ba4eb5a83a29c23fd142f";
//authSign = "81a326d29c9c90469421a4266ee607a7";
if(util.getSessionStorage("userID") != null && util.getSessionStorage("userID") != undefined && util.getSessionStorage("userID") != ""){
    userID = util.getSessionStorage("userID");
    authSign = util.getSessionStorage("authSign");
}
if(userID == "" || userID == undefined || userID == null){
    util.js2Phone();
}
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
});