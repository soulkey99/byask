/**
 * Created by hjy on 2016/6/28 0028.
 */

function changeBgc(obj,color){
    $(obj).css("backgroundColor",color);
}

function changeBgColorYear(obj){
    $(".selectY").each(function(){
        $(this).css("backgroundColor","#c6d1e0");
    });
    $(obj).css("backgroundColor","#4289ff");
    vm.tYear($(obj).find("input").val());
}

function changeBgColor(obj){
    var parentName = $(obj).parent().prev().find("span").text();
    var chidlValue = $(obj).find("input").val();
    if(checkCategory(obj)){
        if($(".selectedTypeDiv").find("span").length >= 7){
            location.href = "#categoryDiv";
            notification.MaterialSnackbar.showSnackbar({message: "专家类型最多可选择7个", timeout: 1500});
        }else{
            $(obj).css("backgroundColor","#4289ff");
            var temp = true, categoryList = vm.categoryList();
            for(var i=0;i<categoryList.length;i++){
                if(categoryList[i].categoryName == parentName){
                    categoryList[i].subCategory.push(chidlValue);
                    temp = false;
                }
            }
            if(temp){
                categoryList.push({categoryName: parentName, subCategory: [chidlValue]});
            }
            vm.categoryList(categoryList);
            vm.categorySelected.push({parentName: parentName, childName: chidlValue});
        }
    }
}

function checkCategory(obj){
    for(var i=0;i<vm.categoryList().length;i++){
        for(var j=0;j<vm.categoryList()[i].subCategory.length;j++){
            if($(obj).parent().prev().find("span").text() == vm.categoryList()[i].categoryName && $(obj).find("input").val() == vm.categoryList()[i].subCategory[j]){
                return false;
            }
        }
    }
    return true;
}

function deleteType(){
    var parent = this.parentName, child = this.childName;
    for(var i=0;i<vm.categoryList().length;i++){
        if(parent == vm.categoryList()[i].categoryName){
            for(var j=0;j<vm.categoryList()[i].subCategory.length;j++){
                if(child == vm.categoryList()[i].subCategory[j]){
                    vm.categoryList()[i].subCategory.splice(j,1);
                }
            }
            if(vm.categoryList()[i].subCategory.length == 0){
                vm.categoryList.splice(i,1);
            }
        }
    }
    $("span").each(function(){
        if($(this).text() == parent){
            $(this).parent().next().find("span").each(function(){
                if($(this).text() == child){
                    $(this).parent().css("backgroundColor","#c6d1e0");
                }
            });
        }
    });
    vm.categorySelected.splice(vm.categorySelected.indexOf(this),1);
}

function showDelete(obj){
    if($(obj).find("img").css("visibility") == "hidden"){
        $(obj).find("img").css("visibility","visible");
    }else{
        $(obj).find("img").css("visibility","hidden");
    }
}

function deletePoint(obj){
    vm.points.splice(vm.points.indexOf($(obj).prev().text()),1);
    $(obj).parent().remove();
    $(".pointClick").show();
}

function addPoint(){
    if(vm.points().length < 3){
        if($("#point").val() != ""){
            vm.points.push($("#point").val());
            $("#point").val("");
            if(vm.points().length == 3){
                $(".pointClick").hide();
            }
            if(vm.checkSwitch()){
                checkPoints();
            }
        }
    }else{
        notification.MaterialSnackbar.showSnackbar({message: "最多只能添加3个标签", timeout: 1500});
        $("#point").val("");
    }
}

function showAddImg(sign){
    vm.photoType(sign);
    $(".addImgBg").removeClass("animated fadeOut");
    $(".addImgBg").css("display","block");
    $(".addImgBg").addClass("animated fadeIn");
    $(".addImgDiv").removeClass("animated fadeOut");
    $(".addImgDiv").css("display","block");
    $(".addImgDiv").addClass("animated fadeIn");
}

function hideAddImg(){
    $(".addImgBg").addClass("animated fadeOut");
    $(".addImgDiv").addClass("animated fadeOut");
    $(".addImgBg").css("display","none");
    $(".addImgDiv").css("display","none");
}

function addImgPhotos(){
    hideAddImg();
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        javascript:callcall.jsCallback('setPhotos', JSON.stringify({"photoType": vm.photoType()}));
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.location = "/setPhotos?photoType="+vm.photoType();
    }
}

function addImgAlbums(){
    hideAddImg();
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        javascript:callcall.jsCallback('setAlbums', JSON.stringify({"photoType": vm.photoType()}));
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        window.location = "/setAlbums?photoType="+vm.photoType();
    }
}

function addImgUrlLoading(photoType){
    $("#"+photoType).css("width","25%");
    $("#"+photoType).css("height","auto");
    $("#"+photoType).attr("src","images/loading.gif");
}

function addImgUrl(imgUrl,photoType){
    vm.photoType("");
    $("#"+photoType).attr("src","");
    $("#"+photoType).attr("src",imgUrl);
    if(imgUrl != "images/photo.png"){
        $("#"+photoType).css("width","100%");
        $("#"+photoType).css("height","100%");
    }
    if(photoType == "card"){
        vm.card(imgUrl);
    }else if(photoType == "photo"){
        vm.photo(imgUrl);
    }else if(photoType == "headPhoto"){
        vm.headPhoto(imgUrl);
    }
}

function subApply(){
    var toast = true, msg = "您有未填的必填项";
    vm.checkSwitch(true);
    checkPoints();
    if(vm.name() == ""){
        location.href = "#nameDiv";
    }else if(vm.city() == ""){
        location.href = "#cityDiv";
    }else if(vm.units() == ""){
        location.href = "#unitsDiv";
    }else if(vm.job() == ""){
        location.href = "#jobDiv";
    }else if(vm.tYear() == ""){
        location.href = "#tYearDiv";
    }else if(vm.introduced() == "" || vm.introduced().length < 80){
        location.href = "#introducedDiv";
    }else if(vm.categoryList().length == 0 || vm.categoryList().length > 7){
        location.href = "#categoryDiv";
    }else if(checkPoints()){
        location.href = "#pointDiv";
    }else if(vm.points().length < 3){
        location.href = "#pointDiv";
    }else if(vm.price() == "" ){
        location.href = "#priceDiv";
    }else if(vm.card() == "images/photo.png"){
        location.href = "#cardDiv";
    }else if(vm.photo() == "images/photo.png"){
        location.href = "#photoDiv";
    }else if(vm.headPhoto() == "images/photo.png"){
        location.href = "#headPhotoDiv";
    }else if(vm.agreeSrc() == "images/disagree.png"){
        location.href = "#protocolDiv";
        msg = "请阅读并同意用户协议";
    }else{
        toast = false;
        var postObj = {
            name: vm.name(),
            company: vm.units(),
            title: vm.job(),
            work_year: vm.tYear(),
            city: vm.city(),
            self_intro: vm.introduced(),
            card: vm.card(),
            banner: vm.photo(),
            avatar: vm.headPhoto(),
            major: vm.points().join(","),
            note_price: parseInt(vm.price())*100,
            category: JSON.stringify(vm.categoryList())
        };
        util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'user/apply?random='+parseInt(Math.random()*10000), postObj, function(data) {
            if(data.code == 900){
                $(".state").show();
            }else{
                util.errorCodeApi(data);
            }
        },"POST");
    }
    if(toast){
        notification.MaterialSnackbar.showSnackbar({message: msg, timeout: 1500});
    }
}

function checkPoints(){
    vm.pointsError(false);
    var res = false;
    for(var i=0;i<vm.points().length;i++){
        if(vm.points()[i].length < 2 || vm.points()[i].length > 6){
            $(".point").eq(i).css("border","1px #f96363 solid");
            $(".point").eq(i).css("color","#f96363");
            res = true;
            vm.pointsError(true);
        }
    }
    return res;
}

function toEditInfo(){
    $(".state").hide();
}

function init(){
    util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'user?random='+parseInt(Math.random()*10000), {}, function(data) {
        if(data.code == 900){
            if(data.info.expert_status == "notVerified"){
                vm.phone(data.info.phone);
                setTimeout(function () {
                    $("body").css("visibility","visible");
                    $("body").addClass("animated fadeIn");
                    setTimeout(function () {
                        $("body").removeClass("animated fadeIn");
                    }, 1000);
                },100);
            }else{
                util.callServerFunction({auth: window.btoa("userID="+userID+"&authSign="+authSign)},'user/apply?random='+parseInt(Math.random()*10000), {}, function(data) {
                    if (data.code == 900) {
                        if (data.info.status == "pending") {
                            $(".state").show();
                        } else if (data.info.status == "fail") {
                            $("#card,#photo,#headPhoto").css("width","100%");
                            $("#card,#photo,#headPhoto").css("height","100%");
                            $("#errorNote").show();
                            $("header").find("img").attr("src", "images/errorHeader.png");
                            vm.name(data.info.info.name);
                            vm.units(data.info.info.company);
                            vm.job(data.info.info.title);
                            vm.phone(data.info.phone);
                            vm.tYear(data.info.info.work_year);
                            vm.city(data.info.info.city);
                            vm.introduced(data.info.info.self_intro);
                            vm.card(data.info.info.card);
                            vm.photo(data.info.info.banner);
                            vm.headPhoto(data.info.info.avatar);
                            vm.points(data.info.info.major);
                            vm.price(parseInt(data.info.info.note_price) / 100);
                            vm.errorPointList(data.info.rejectReason);
                            vm.categoryList(data.info.info.category);
                        } else if (data.info.status == "verified") {
                            $("#card,#photo,#headPhoto").css("width","100%");
                            $("#card,#photo,#headPhoto").css("height","100%");
                            $("header").hide();
                            $("footer").text("申请修改");
                            vm.name(data.info.info.name);
                            vm.units(data.info.info.company);
                            vm.job(data.info.info.title);
                            vm.phone(data.info.phone);
                            vm.tYear(data.info.info.work_year);
                            vm.city(data.info.info.city);
                            vm.introduced(data.info.info.self_intro);
                            vm.card(data.info.info.card);
                            vm.photo(data.info.info.banner);
                            vm.headPhoto(data.info.info.avatar);
                            vm.points(data.info.info.major);
                            vm.price(parseInt(data.info.info.note_price) / 100);
                            vm.categoryList(data.info.info.category);
                            for(var i=0;i<vm.categoryList().length;i++){
                                for(var j=0;j<vm.categoryList()[i].subCategory.length;j++){
                                    $("span").each(function(){
                                        if($(this).text() == vm.categoryList()[i].categoryName){
                                            $(this).parent().next().find("span").each(function(){
                                               if($(this).text() == vm.categoryList()[i].subCategory[j]){
                                                   $(this).parent().css("backgroundColor","#4289ff");
                                               }
                                            });
                                        }
                                    })
                                    vm.categorySelected.push({parentName: vm.categoryList()[i].categoryName, childName: vm.categoryList()[i].subCategory[j]});
                                }
                            }
                        } else {
                            vm.phone(data.info.phone);
                            vm.categoryList([]);
                            vm.categorySelected([]);
                        }
                        $("body").css("visibility","visible");
                        if (data.info.status != "pending") {
                            $("body").addClass("animated fadeIn");
                            setTimeout(function () {
                                $("body").removeClass("animated fadeIn");
                            }, 1000);
                        }
                    } else {
                        util.errorCodeApi(data);
                    }
                },"GET")
                document.title = "我的资料";
            }
        }else{
            util.errorCodeApi(data);
        }
    },"GET");
}

function checkWithdrawalsNum(obj){
    obj.value = obj.value.replace(/\D/gi,'').replace(/^0/,'');
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

function agree(){
    if(vm.agreeSrc() == "images/disagree.png"){
        vm.agreeSrc("images/agree.png");
    }else{
        vm.agreeSrc("images/disagree.png");
    }
}

function showAgreement(){
    //$.confirm({
    //    content: 'url:../userAgreement/index.html',
    //    title: false,
    //    confirmButton: '同意',
    //    cancelButton: '不同意',
    //    theme: "material",
    //    columnClass: "mdl-cell mdl-cell--12-col mdl-cell--12-col-phone",
    //    backgroundDismiss: true,
    //    closeIcon: true,
    //    confirm: function () {
    //        vm.agreeSrc("images/agree.png");
    //    },
    //    cancel: function () {
    //        vm.agreeSrc("images/disagree.png");
    //    },
    //    confirmButtonClass: 'mdl-button mdl-js-button mdl-button--raised',
    //    cancelButtonClass: 'mdl-button mdl-js-button mdl-button--raised',
    //    contentLoaded: function(data, status, xhr){}
    //});
    //setTimeout(function(){
    //    $(".content-pane").css("height",$(window).height()-200+"px");
    //    $(".content-pane").css("overflow-y","auto");
    //    $(".content-pane").css("overflow-x","hidden");
    //},800);
    $(".userAgreement").css("display","block");
    $(".userAgreement").removeClass("animated slideInRight");
    $(".userAgreement").addClass("animated slideInRight");
    $(".agreeContent").load("../userAgreement/index.html");
}

function agree(){
    vm.agreeSrc("images/agree.png");
    $(".userAgreement").addClass("animated slideOutRight");
    setTimeout(function(){
        $(".userAgreement").css("display","none");
        $(".userAgreement").removeClass("animated slideOutRight");
    },1000);
}

function disagree(){
    vm.agreeSrc("images/disagree.png");
    $(".userAgreement").addClass("animated slideOutRight");
    setTimeout(function(){
        $(".userAgreement").css("display","none");
        $(".userAgreement").removeClass("animated slideOutRight");
    },1000);
}

var viewModel = function() {
    this.name = ko.observable("");
    this.units = ko.observable("");
    this.job = ko.observable("");
    this.tYear = ko.observable("");
    this.phone = ko.observable("");
    this.city = ko.observable("");
    this.introduced = ko.observable("");
    this.points = ko.observableArray("");
    this.errorPointList = ko.observableArray("");
    this.pointsError = ko.observable(false);
    this.price = ko.observableArray("");
    this.card = ko.observable("images/photo.png");
    this.photo = ko.observable("images/photo.png");
    this.headPhoto = ko.observable("images/photo.png");
    this.photoType = ko.observable("");
    this.checkSwitch = ko.observable(false);
    this.category = ko.observable("");
    this.topics  = ko.observableArray("");
    this.categoryList  = ko.observableArray("");
    this.categorySelected  = ko.observableArray("");
    this.deleteType = deleteType;
    this.agreeSrc = ko.observable("images/disagree.png");
};
var vm = new viewModel()
    ,u = navigator.userAgent
    ,userID = util.getQueryString("userID")
    ,authSign = util.getQueryString("authSign")
    ,notification = document.querySelector('.mdl-js-snackbar');
//test
userID = "560ba4eb5a83a29c23fd142f";
authSign = "zzz";
if(util.getSessionStorage("userID") != null && util.getSessionStorage("userID") != undefined && util.getSessionStorage("userID") != ""){
    userID = util.getSessionStorage("userID");
    authSign = util.getSessionStorage("authSign");
}
if(userID == "" || userID == undefined || userID == null){
    util.js2Phone();
}
init();
loadTopics();
$(document).ready(function(){
    FastClick.attach(document.body);
    ko.applyBindings(vm,document.getElementById("body"));
    $(".addImgBg, .state").css("height",$(window).height() + "px");
    $(".state, #errorNote").hide();
    $(document).on("focus","input,textarea",function(){$("footer").hide();});
    $(document).on("blur","input,textarea",function(){$("footer").show();});
});