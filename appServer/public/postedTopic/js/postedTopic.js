/**
 * Created by hjy on 2016/7/13 0013.
 */

function changeBgc(obj,color){
    $(obj).css("backgroundColor",color);
}

function changeBgColor(obj, type){
    if(type == "category"){
        $(".category").each(function(){
            $(this).css("backgroundColor","#c6d1e0");
        });
        vm.category($(obj).parent().parent().find(".topicTitle").text());
        vm.subCategory($(obj).find("input").val());
    }else if(type == "time"){
        $(".time").each(function(){
            $(this).css("backgroundColor","#c6d1e0");
        });
        vm.time($(obj).find("input").val());
    }
    $(obj).css("backgroundColor","#4289ff");
}

function subPost(){
    var toast = true, msg = "您有未填的必填项";
    vm.checkSwitch(true);
    if(vm.name() == "" || vm.name().length>16){
        location.href = "#nameDiv";
    }else if(vm.introduction() == "" || vm.introduction().length<40){
        location.href = "#introductionDiv";
        msg = "私课介绍内容至少为40字";
    }else if(vm.subCategory() == ""){
        location.href = "#categoryDiv";
    }else if(vm.price() == "" ){
        location.href = "#priceDiv";
    }else if(vm.time() == ""){
        location.href = "#timeDiv";
    }else{
        toast = false;
        var postObj = {
            title: vm.name(),
            description: vm.introduction(),
            category: vm.category(),
            subCategory: vm.subCategory(),
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
    if(toast){
        notification.MaterialSnackbar.showSnackbar({message: msg, timeout: 1500});
    }
}

function loadTopics(){
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'topic/category?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900){
            vm.topics(data.list);
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function showTopics(obj){
    var display = $(obj).parent().find(".selectRowCategory").css("display");
    if(display == "none"){
        $(obj).parent().find(".selectRowCategory").slideDown();
        $(obj).find("img").removeClass("arrowRotateN");
        $(obj).find("img").addClass("arrowRotateS");
    }else{
        $(obj).parent().find(".selectRowCategory").slideUp();
        $(obj).find("img").removeClass("arrowRotateS");
        $(obj).find("img").addClass("arrowRotateN");
    }
}

var viewModel = function() {
    this.name = ko.observable("");
    this.category = ko.observable("");
    this.subCategory = ko.observable("");
    this.time = ko.observable("");
    this.introduction = ko.observable("");
    this.price = ko.observable("");
    this.checkSwitch = ko.observable(false);
    this.topics = ko.observableArray();
};
var vm = new viewModel()
    ,u = navigator.userAgent
    ,userID = util.getQueryString("userID")
    ,authSign = util.getQueryString("authSign")
    ,notification = document.querySelector('.mdl-js-snackbar');
//test
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
    loadTopics();
    $(document).on("focus","input,textarea",function(){$("footer").hide();});
    $(document).on("blur","input,textarea",function(){$("footer").show();});
});
