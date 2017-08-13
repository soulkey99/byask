/**
 * Created by hjy on 2016/8/4 0004.
 */

"use strict";

function loadUserID(){
    util.callServerFunction({},'share/'+ share_id +'?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900){
            vm.userID(data.info.userID);
            loadUserInfo();
            loadUserTopic();
            loadUserComment();
            loadUserIntro();
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function loadUserInfo(){
    util.callServerFunction({},'user/'+ vm.userID() +'?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900){
            vm.avatar(data.info.avatar);
            vm.name(data.info.expert_info.name);
            vm.title(data.info.expert_info.title);
            vm.major(data.info.expert_info.major);
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function loadUserTopic(){
    util.callServerFunction({},'user/'+ vm.userID() +'/topics?random='+parseInt(Math.random()*10000), {limit: 5}, function(data) {
        if(data.code == 900){
            for(var i=1;i<data.list.length;i++){
                vm.topics.push(data.list[i]);
            }
            vm.topic(data.list[0]);
            vm.topics(data.list[0]);
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function loadUserComment(){
    util.callServerFunction({},'user/'+ vm.userID() +'/comments?random='+parseInt(Math.random()*10000), {limit: 5}, function(data) {
        if(data.code == 900){
            if(data.list.length == 0){
                vm.comment(data.list);
            }else{
                for(var i=0;i<2;i++){
                    vm.comment.push(data.list[i]);
                }
            }
            vm.comments(data.list);
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function loadUserIntro(){
    util.callServerFunction({},'user/'+ vm.userID() +'/intro?random='+parseInt(Math.random()*10000), {limit: 5}, function(data) {
        if(data.code == 900){
            vm.banner(data.banner);
            vm.intro(data.self_intro);
            vm.introShort(data.self_intro);
            if(data.self_intro.length > 100){
                vm.introShort(data.self_intro.substring(0,100));
            }
            $("body").css("display","block");
            $("body").addClass("animated fadeIn");
            setTimeout(function () {
                $("body").removeClass("animated fadeIn");
            }, 1000);
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}


function changeBgc(obj,color){
    $(obj).css("backgroundColor",color);
}

function changeBtn(obj){
    if($(obj).attr("src") == "images/downloadBtnOut.png"){
        $(obj).attr("src","images/downloadBtnIn.png");
    }else{
        $(obj).attr("src","images/downloadBtnOut.png");
    }
}

function showMoreInfo(obj){
    var divObj = $(obj).parent().parent().parent().parent().parent();
    var display = divObj.find(".content").css("display");
    if(display == "none"){
        divObj.find(".content").slideDown();
        divObj.find(".reservationBtnDiv").fadeIn();
        $(obj).find("img").removeClass("arrowRotateN");
        $(obj).find("img").addClass("arrowRotateS");
    }else{
        divObj.find(".content").slideUp();
        divObj.find(".reservationBtnDiv").fadeOut();
        $(obj).find("img").removeClass("arrowRotateS");
        $(obj).find("img").addClass("arrowRotateN");
    }
    $(obj).remove();
}

function showMoreComment(){
    $("#btn1").remove();
    vm.comment(vm.comments());
}

function showMoreIntro(){
    $("#btn2").remove();
    vm.introShort(vm.intro());
}

function isDownload(){
    $(".downloadBg").css("display","block");
}

function cancel(){
    $(".downloadBg").css("display","none");
}

function download(){
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.soulkey.callcall";
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.location.href = "";
    }
}

var viewModel = function() {
    this.userID = ko.observable("");
    this.avatar = ko.observable("");
    this.name = ko.observable("");
    this.title = ko.observable("");
    this.major = ko.observableArray();
    this.topics = ko.observableArray();
    this.topic = ko.observableArray();
    this.comments = ko.observableArray();
    this.comment = ko.observableArray();
    this.banner = ko.observable("");
    this.intro = ko.observable("");
    this.introShort = ko.observable("");
};
var vm = new viewModel()
    ,u = navigator.userAgent
    ,share_id = util.getQueryString("share_id");
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $(".downloadBg").css("height",$(window).height() + "px");
    $(".downloadBg").css("lineHeight",$(window).height() + "px");
    loadUserID();
});

