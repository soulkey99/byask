/**
 * Created by hjy on 2016/8/4 0004.
 */

"use strict";

function loadUserID(){
    util.callServerFunction({},'share/'+ share_id +'?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900){
            vm.noteID(data.info.note_id);
            loadNoteInfo();
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function loadNoteInfo(){
    util.callServerFunction({},'note/'+ vm.noteID() +'?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900){
            vm.userAvatar(data.info.user_info.avatar);
            vm.userNick(data.info.user_info.nick);
            vm.userPrice(data.info.price/100);
            vm.userContent(data.info.content);
            vm.expertAvatar(data.info.expert_info.avatar);
            vm.expertName(data.info.expert_info.name);
            vm.expertTitle(data.info.expert_info.title);
            vm.noteLength(data.info.length);
            vm.listenerNum(data.info.listen);
            vm.needPay(data.info.needPay);
            vm.reply(data.info.reply);
            for(var i=0;i<data.info.listeners.length;i++){
                if(i==5){
                    break;
                }else{
                    vm.listenerList.push(data.info.listeners[i]);
                }
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

function changeBtn(obj){
    if($(obj).attr("src") == "images/downloadBtnOut.png"){
        $(obj).attr("src","images/downloadBtnIn.png");
    }else{
        $(obj).attr("src","images/downloadBtnOut.png");
    }
}

function isDownload(){
    //$(".downloadBg").css("display","block");
    if(code != "" && code != undefined && code != null){
        if(vm.needPay()){
            util.callServerFunction({auth: window.btoa("userID="+vm.userID()+"&authSign="+vm.authSign())},'note/'+ vm.noteID() +'/listen?random='+parseInt(Math.random()*10000), {channel:"wx_pub"}, function(data) {
                if(data.code == 900){
                    pingpp.createPayment(data.charge, function(result, err){
                        //console.log(result);
                        //console.log(err.msg);
                        //console.log(err.extra);
                        if (result == "success") {
                            alert("支付成功");
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                            util.callServerFunction({auth: window.btoa("userID="+vm.userID()+"&authSign="+vm.authSign())},'note/'+ vm.noteID() +'/reply?random='+parseInt(Math.random()*10000), {channel:"wx_pub"}, function(data) {
                                if(data.code == 900){
                                    vm.reply(data.reply);
                                    vm.noteLength(data.length);
                                    $("#audioText").html("<span id='audioCtrl' style='margin-left: 15%;'>开始</span>");
                                    $("#audioMain").attr("src","http://123.57.16.157:8062/redirectAmr?url="+ vm.reply());
                                    $(".expertContent").attr("onclick","audioCtrl();");
                                }else{
                                    util.errorCodeApi(data);
                                }
                            },"GET");
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                            alert("支付失败，请稍后再试");
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                            alert("已取消支付");
                        }
                    });
                }else{
                    util.errorCodeApi(data);
                }
            },"POST");
        }else{
            $("#audioSpan").html("<span id='audioCtrl' style='margin-left: 10%;'>开始</span><audio id='audioMain' src='http://123.57.16.157:8062/redirectAmr?url="+ vm.reply() +"' style='width: 148px;height: 35px;display: none;'></audio>");
            $(".expertContent").attr("onclick","audioCtrl();");
        }
    }else{
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc935368aa45ca968&redirect_uri=https://api.test.iwenda.me/share/shareNote.html?share_id="+ share_id +"&response_type=code&scope=snsapi_userinfo&state=snsapi_base#wechat_redirect";
    }
}

function cancel(){
    $(".downloadBg").css("display","none");
}

function download(){
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        window.location.href = "";
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.location.href = "";
    }
}

function audioCtrl(){
    var audioMain = document.getElementById("audioMain");
    if($("#audioCtrl").text() == "开始"){
        audioMain.play();
        $("#audioCtrl").text("暂停");
    }else{
        audioMain.pause();
        $("#audioCtrl").text("开始");
    }
}

var viewModel = function() {
    this.noteID = ko.observable("");
    this.userAvatar = ko.observable("");
    this.userNick = ko.observable("");
    this.userPrice = ko.observable("");
    this.userContent = ko.observable("");
    this.expertAvatar = ko.observable("");
    this.expertName = ko.observable("");
    this.expertTitle = ko.observable("");
    this.noteLength = ko.observable("");
    this.listenerList = ko.observableArray();
    this.listenerNum = ko.observable("");
    this.needPay = ko.observable("");
    this.userID = ko.observable("");
    this.authSign = ko.observable("");
    this.reply = ko.observable("");
};
var vm = new viewModel()
    ,u = navigator.userAgent
    ,share_id = util.getQueryString("share_id")
    ,code = util.getQueryString("code");
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm);
    $(".downloadBg").css("height",$(window).height() + "px");
    $(".downloadBg").css("lineHeight",$(window).height() + "px");
    loadUserID();
    if(code != "" && code != undefined && code != null){
        $.ajax({
            type: 'GET',
            async: true,
            url: '/rest/wx_oauth?code=' + code,
            dataType: 'json',
            success: function (data) {
                if (data.code == 900) {
                    vm.userID(data.info.userID);
                    vm.authSign(data.info.authSign);
                    console.log(data.info);
                } else {
                    console.log(data.msg);
                }
            }
        });
    }
    document.getElementById("audioMain").addEventListener("ended",function(){
        $("#audioCtrl").text("开始");
    });
});