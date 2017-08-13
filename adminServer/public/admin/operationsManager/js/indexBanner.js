/**
 * Created by hjy on 2016/7/28 0028.
 */

function loadIndexBannerList(){
    var postObj = {
        start: (vm.startPos()-1)*vm.pageSize()+1,
        limit: vm.pageSize(),
        valid: $("#valid").val()
    };
    //if($("#time").val() != ""){
    //    postObj.time = new Date($("#time").val()).getTime();
    //}
    util.callServerFunction({},'banner', postObj, function(resp){
        if(resp.code == 900){
            vm.indexBannerList.removeAll();
            if (resp.list.length > 0) {
                vm.indexBannerList(resp.list);
            }else if (vm.startPos() != 1) {
                vm.startPos(vm.startPos() - 1);
                loadIndexBannerList();
                $.dialog({
                    icon: 'icon icon-warning',
                    title: '提示信息',
                    content: "您已经在最后一页了！",
                    theme: "material",
                    columnClass: "col l6 offset-l3 s12"
                })
            }
        }else{
            util.errorCodeApi(resp);
        }
    },"GET");
}

function prevPage(){
    if(vm.startPos()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPos(vm.startPos()-1);
        loadIndexBannerList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadIndexBannerList();
}

function subLoadIndexBannerList(){
    vm.startPos(1);
    vm.pageSize(15);
    loadIndexBannerList();
}

function initAddBanner(){
    vm.oldSrc("");
    vm.banner_id("");
    vm.tempSrc("");
    var html = "<div class='input-field col s12'>"+
        "<input type='file' id='banner' style='display: none'/>"+
        "<button type='button' class='btn' onclick='selectImg()'>选择文件</button>&nbsp;&nbsp;图片建议尺寸：1600像素 * 900像素(16:9)"+
        "<img id='tempImg' style='width: 100%;height: auto;margin-top: 5px' src=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>有效时间</label>" +
        "<input id='startTime' type='text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>失效时间</label>" +
        "<input id='endTime' type='text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>备注</label><input type='text' class='validate' id='remark'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='actionType' onchange='changeInfo(this)'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='user'>跳转至专家</option>"+
        "</select>"+
        "<label for='actionType'>点击跳转类型</label>" +
        "</div>"+
        "<div class='input-field col s12' id='expertName'>"+
        "<button class='btn' onclick='selectExpert()'>选择专家</button>" +
        "<input id='expertNick' class='validate' type='text' readonly>"+
        "<input id='dest' type='hidden'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick='uploadBanner()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '新增Banner',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#expertName").hide();
    $('select').material_select();
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $("#banner").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.tempSrc(url);
            $("#tempImg").attr('src',url);
        };
    });
}

function selectImg(){
    $("#banner").click();
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function uploadBanner(){
    if($("#tempImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择Banner图片！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#startTime").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择有效时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#endTime").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择失效时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#actionType").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择链接类型！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#actionType").val() == "user" && $("#dest").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择链接专家！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#seq").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写显示顺序！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#validAdd")!=undefined && $("#validAdd").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择是/否有效！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else {
        if (vm.tempSrc() != "") {
            util.upLoadImg(vm.tempSrc(),callback);
        } else {
            callback();
        }
    }
}

function callback(){
    var apiName = "banner";
    if(vm.banner_id() != ""){
        apiName = "banner/"+vm.banner_id();
    }
    if(vm.tempSrc() != ""){
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            var imgsrc = JSON.parse(xhr.response).filePath;
            var postObj = {
                startAt: new Date($("#startTime").val()).getTime(),
                endAt: new Date($("#endTime").val()).getTime(),
                valid: $("#validAdd").val(),
                remark: $("#remark").val(),
                type: $("#actionType").val(),
                dest: $("#dest").val(),
                img: imgsrc,
                seq: $("#seq").val()
            };
            util.callServerFunction({}, apiName, postObj, function (resp) {
                if (resp.code == 900) {
                    Materialize.toast('添加成功', 3000);
                    dialog.close();
                    subLoadIndexBannerList();
                } else {
                    util.errorCodeApi(resp);
                }
            },"POST");
        }
    }else{
        var imgsrc = vm.oldSrc();
        var postObj = {
            startAt: new Date($("#startTime").val()).getTime(),
            endAt: new Date($("#endTime").val()).getTime(),
            valid: $("#validAdd").val(),
            remark: $("#remark").val(),
            type: $("#actionType").val(),
            dest: $("#dest").val(),
            img: imgsrc,
            seq: $("#seq").val()
        };
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('编辑成功', 3000);
                dialog.close();
                subLoadIndexBannerList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function initEditBanner(){
    vm.oldSrc(this.img);
    vm.banner_id(this.banner_id);
    vm.tempSrc("");
    var html = "<div class='input-field col s12'>"+
        "<input type='file' id='banner' style='display: none'/>"+
        "<button type='button' class='btn' onclick='selectImg()'>选择文件</button>&nbsp;&nbsp;图片建议尺寸：1600像素 * 900像素(16:9)"+
        "<img id='tempImg' style='width: 100%;height: auto;margin-top: 5px' src='"+ this.img +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>有效时间</label>" +
        "<input id='startTime' type='text' value='"+ util.convertTime2Str(this.startAt) +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>失效时间</label>" +
        "<input id='endTime' type='text' value='"+ util.convertTime2Str(this.endAt) +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>备注</label><input type='text' class='validate' id='remark' value='"+ this.remark +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='actionType' onchange='changeInfo(this)'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='user'>跳转至专家</option>"+
        "</select>"+
        "<label for='actionType'>点击跳转类型</label>" +
        "</div>"+
        "<div class='input-field col s12' id='expertName'>"+
        "<button class='btn' onclick='selectExpert()'>选择专家</button>" +
        "<input id='expertNick' class='validate' type='text' readonly value='"+ this.dest +"'>"+
        "<input id='dest' type='hidden' value='"+ this.dest +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='validAdd'>"+
        "<option value=''>-请选择-</option>"+
        "<option value='true'>有效</option>"+
        "<option value='false'>无效</option>"+
        "</select>"+
        "<label>是/否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）' value='"+ this.seq +"'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick='uploadBanner()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-document-edit",
        title: '编辑Banner',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#actionType").val(this.type);
    $("#validAdd").val(this.valid+"");
    $('select').material_select();
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $("#banner").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.tempSrc(url);
            $("#tempImg").attr('src',url);
        };
    });
}

function setValid(){
    var postObj = {
        valid: !this.valid
    };
    util.callServerFunction({},'banner/'+this.banner_id, postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadIndexBannerList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

function showSrcImg(){
    $.dialog({
        icon: "icon icon-document-edit",
        title: '原图',
        content: "<div align='center'><button class='btn btn-success' onclick=\"util.rotateImg('testImg', 'left')\"><span class='entypo-ccw'></span>&nbsp;&nbsp;左转</button>&nbsp;&nbsp;"+
        "<button class='btn btn-success' onclick=\"util.rotateImg('testImg', 'right')\">右转&nbsp;&nbsp;<span class='entypo-cw'></span></button></div>" +
        "<br><img style='width:100%;max-width:100%;height:auto' src='"+ this.img +"' id='testImg'>",
        theme: "material",
        columnClass: "col-lg-6 col-lg-offset-3 col-xs-12 s12"
    });
}

function changeInfo(obj){
    if($(obj).val() == "user"){
        $("#expertName").show();
    }else{
        $("#expertName").hide();
    }
}

function selectExpert(){
    vm.expertList("");
    var html = "<div id='expertDiv'>" +
        "<div class='row'>" +
        "<div class='input-field col l3 s6'>" +
        "<input id='name' type='text'>" +
        "<label for='name' class=''>专家姓名</label>" +
        "</div>" +
        "<div class='input-field col l3 s6'>" +
        "<input id='nick' type='text'>" +
        "<label for='nick' class=''>专家昵称</label>" +
        "</div>" +
        "<div class='input-field col l3 s6'>" +
        "<input id='phone' type='text'>" +
        "<label for='phone' class=''>专家手机号</label>" +
        "</div>" +
        "<div class='input-field col l3 s6'>" +
        "<a class='waves-effect waves-light btn' href='javascript:searchExpert()'>检 索</a>" +
        "</div>" +
        "</div>" +
        "<table class='bordered highlight responsive-table'>" +
        "<thead>" +
        "<tr>" +
        "<th align='center'></th>" +
        "<th align='center'>头像</th>" +
        "<th align='center'>昵称</th>" +
        "<th align='center'>电话</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody data-bind='foreach: expertList'>" +
        "<tr>" +
        "<td align='center'><input type='radio' class='mdl-radio__button' name='expertId' data-bind='click: getSelectExpert'></td>" +
        "<td align='left'><img data-bind='attr: {src: user.avatar}' class='circle responsive-img' style='width: 20%;height: auto'></td>" +
        "<td align='left'><span data-bind='text: nick'></span></td>" +
        "<td align='left'><span data-bind='text: phone'></span></td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "</div>";
    var dialogPoint = $.dialog({
        icon: "icon icon-plus",
        title: "添加专家链接",
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    ko.applyBindings(vm,document.getElementById("expertDiv"));
}

function getSelectExpert(){
    $("#dest").val(this.userID);
    $("#expertNick").val(this.nick);
    return true;
}

function searchExpert(){
    if($("#name").val() == "" && $("#phone").val() == "" && $("#nick").val()==""){
        $.dialog({
            title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示信息</span>",
            content: "请设置检索条件！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var postObj = {
            name: $("#name").val(),
            phone: $("#phone").val(),
            nick: $("#nick").val(),
            getExpert: true,
            getAll: true
        };
        util.callServerFunction({},"users",postObj, function (data) {
            if(data.code == 900){
                vm.expertList(data.list);
            }else{
                util.errorCodeApi(data);
            }
        },"GET")
    }
}

var viewModel = function(){
    this.indexBannerList = ko.observableArray();
    this.expertList = ko.observableArray();
    this.tempSrc = ko.observable();
    this.banner_id = ko.observable("");
    this.oldSrc = ko.observable("");
    this.initEditBanner = initEditBanner;
    this.setValid = setValid;
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.subLoadIndexBannerList = subLoadIndexBannerList;
    this.showSrcImg = showSrcImg;
    this.expertId = ko.observable("");
    this.getSelectExpert = getSelectExpert;
}
var vm = new viewModel()
    ,xhr = new XMLHttpRequest()
    ,date = new Date()
    ,todayStartDate = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' 00:00:00'
    ,todayEndDate = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' 23:59:59'
    ,dialog = "";
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("indexBannerMain"));
    loadIndexBannerList();
    util.initDateTimePicker("time",{});
    document.onkeydown = function(event){
        e = event ? event :(window.event ? window.event : null);
        if(e.keyCode==13){
            subLoadIndexBannerList();
            return false;
        }
    }
    $('select').material_select();
    $.datetimepicker.setLocale("ch");
});