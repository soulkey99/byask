/**
 * Created by hjy on 2016/8/26 0026.
 */

function loadAdList(){
    var postObj = {
        start: (vm.startPos()-1)*vm.pageSize()+1,
        limit: vm.pageSize(),
        valid: $("#valid").val(),
        type: $("#type").val(),
        platform: $("#platform").val()
    };
    util.callServerFunction({},'home/advertise', postObj, function(resp){
        if(resp.code == 900){
            vm.adList.removeAll();
            if (resp.list.length > 0) {
                vm.adList(resp.list);
            }else if (vm.startPos() != 1) {
                vm.startPos(vm.startPos() - 1);
                loadAdList();
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
        loadAdList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadAdList();
}

function subLoadAdList(){
    vm.startPos(1);
    vm.pageSize(15);
    loadAdList();
}

function showSrcImg(){
    $.dialog({
        icon: "icon icon-document-edit",
        title: '原图',
        content: "<div align='center'><button class='btn btn-success' onclick=\"util.rotateImg('testImg', 'left')\"><span class='entypo-ccw'></span>&nbsp;&nbsp;左转</button>&nbsp;&nbsp;"+
        "<button class='btn btn-success' onclick=\"util.rotateImg('testImg', 'right')\">右转&nbsp;&nbsp;<span class='entypo-cw'></span></button></div>" +
        "<br><img style='width:100%;max-width:100%;height:auto' src='"+ this.content.img +"' id='testImg'>",
        theme: "material",
        columnClass: "col-lg-6 col-lg-offset-3 col-xs-12 s12"
    });
}

function initAddAd(){
    vm.platforms([]);
    vm.oldSrc("");
    vm.ad_id("");
    vm.tempSrc("");
    var html = "<div class='input-field col s12'>"+
        "<input type='file' id='adImg' style='display: none'/>"+
        "<button type='button' class='btn' onclick='selectImg()'>选择文件</button>&nbsp;&nbsp;"+
        "<img id='tempImg' style='width: 100%;height: auto;margin-top: 5px' src=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>有效时间</label>" +
        "<input id='startAt' type='text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>失效时间</label>" +
        "<input id='endAt' type='text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='adType'>"+
        "<option value='homePop'>首页弹出广告位</option>"+
        "<option value='homeHide'>首页弹出广告位(隐藏)</option>"+
        "<option value='banner'>首页banner位</option>"+
        "<option value='splash'>闪屏页</option>"+
        "</select>"+
        "<label for='adType'>广告类型</label>" +
        "</div>"+
        "<div class='col s12'>"+
        "<label>操作系统</label><br>" +
        "<input type='checkbox' name='platform' value='android' id='android'><label for='android' style='margin-right: 10px'>安卓</label>"+
        "<input type='checkbox' name='platform' value='ios' id='ios'><label for='ios' style='margin-right: 10px'>苹果</label><br>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='adValid'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='true'>有效</option>"+
        "<option value='false'>无效</option>"+
        "</select>"+
        "<label for='adValid'>是/否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>备注</label><input type='text' class='validate' id='remark'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='content_type'>"+
        "<option value='url'>链接</option>"+
        "</select>"+
        "<label for='actionType'>点击跳转类型</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>跳转目标</label><input type='text' class='validate' id='content_dest'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>文字内容</label><input type='text' class='validate' id='content_text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick='uploadAd()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '新增广告',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
    $.datetimepicker.setLocale("ch");
    $('#startAt').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endAt').datetimepicker({format: 'Y-m-d H:i:s'});
    $("#adImg").change(function() {
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
    $("#adImg").click();
}

function uploadAd(){
    $("input[name='platform']").each(function(){
        if($(this).prop("checked")){
            vm.platforms.push($(this).val());
        }
    });
    if($("#tempImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择广告图片！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#startAt").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择生效时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#endAt").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择失效时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if(vm.platforms().length <= 0){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择操作系统！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#adValid").val() == ""){
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
    var apiName = "home/advertise";
    if(vm.ad_id() != ""){
        apiName = "home/advertise/"+vm.ad_id();
    }
    if(vm.tempSrc() != ""){
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            var imgsrc = JSON.parse(xhr.response).filePath;
            var postObj = {
                content_img: imgsrc,
                startAt: new Date($("#startAt").val()).toJSON(),
                endAt: new Date($("#endAt").val()).toJSON(),
                type: $("#adType").val(),
                valid: $("#adValid").val(),
                platform: vm.platforms().join(","),
                remark: $("#remark").val(),
                content_type: $("#content_type").val(),
                content_dest: $("#content_dest").val(),
                content_text: $("#content_text").val(),
                seq: $("#seq").val()
            };
            util.callServerFunction({}, apiName, postObj, function (resp) {
                if (resp.code == 900) {
                    Materialize.toast('添加成功', 3000);
                    dialog.close();
                    subLoadAdList();
                } else {
                    util.errorCodeApi(resp);
                }
            },"POST");
        }
    }else{
        var imgsrc = vm.oldSrc();
        var postObj = {
            content_img: imgsrc,
            startAt: new Date($("#startAt").val()).toJSON(),
            endAt: new Date($("#endAt").val()).toJSON(),
            type: $("#adType").val(),
            valid: $("#adValid").val(),
            platform: vm.platforms().join(","),
            remark: $("#remark").val(),
            content_type: $("#content_type").val(),
            content_dest: $("#content_dest").val(),
            content_text: $("#content_text").val(),
            seq: $("#seq").val()
        };
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('编辑成功', 3000);
                dialog.close();
                subLoadAdList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function initEditAd(){
    vm.platforms([]);
    vm.oldSrc(this.content.img);
    vm.ad_id(this.ad_id);
    vm.tempSrc("");
    var html = "<div class='input-field col s12'>"+
        "<input type='file' id='adImg' style='display: none'/>"+
        "<button type='button' class='btn' onclick='selectImg()'>选择文件</button>&nbsp;&nbsp;"+
        "<img id='tempImg' style='width: 100%;height: auto;margin-top: 5px' src='"+ this.content.img +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>有效时间</label>" +
        "<input id='startAt' type='text' value='"+ util.convertTime2StrNew(this.startAt) +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>失效时间</label>" +
        "<input id='endAt' type='text' value='"+ util.convertTime2StrNew(this.endAt) +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='adType'>"+
        "<option value='homePop'>首页弹出广告位</option>"+
        "<option value='homeHide'>首页弹出广告位(隐藏)</option>"+
        "<option value='banner'>首页banner位</option>"+
        "<option value='splash'>闪屏页</option>"+
        "</select>"+
        "<label for='adType'>广告类型</label>" +
        "</div>"+
        "<div class='col s12'>"+
        "<label>操作系统</label><br>";
        if(this.platform.indexOf("android")>=0){
            html += "<input type='checkbox' name='platform' value='android' id='android' checked><label for='android' style='margin-right: 10px'>安卓</label>";
        }else{
            html += "<input type='checkbox' name='platform' value='android' id='android'><label for='android' style='margin-right: 10px'>安卓</label>";
        }
        if(this.platform.indexOf("ios")>=0){
            html += "<input type='checkbox' name='platform' value='ios' id='ios' checked><label for='ios' style='margin-right: 10px'>苹果</label><br>";
        }else{
            html += "<input type='checkbox' name='platform' value='ios' id='ios'><label for='ios' style='margin-right: 10px'>苹果</label><br>";
        }
        html += "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='adValid'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='true'>有效</option>"+
        "<option value='false'>无效</option>"+
        "</select>"+
        "<label for='adValid'>是/否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>备注</label><input type='text' class='validate' id='remark' value='"+ this.remark +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='content_type'>"+
        "<option value='url'>链接</option>"+
        "</select>"+
        "<label for='actionType'>点击跳转类型</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>跳转目标</label><input type='text' class='validate' id='content_dest'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>文字内容</label><input type='text' class='validate' id='content_text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active' class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick='uploadAd()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑广告',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#adType").val(this.type);
    $("#adValid").val(this.valid+"");
    $("#content_type").val(this.content.type);
    $("#content_dest").val(this.content.dest);
    $("#content_text").val(this.content.text);
    $("#seq").val(this.seq);
    $('select').material_select();
    $.datetimepicker.setLocale("ch");
    $('#startAt').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endAt').datetimepicker({format: 'Y-m-d H:i:s'});
    $("#adImg").change(function() {
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
    util.callServerFunction({},'home/advertise/'+this.ad_id, postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadAdList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

var viewModel = function(){
    this.adList = ko.observableArray();
    this.platforms = ko.observableArray();
    this.oldSrc = ko.observable("");
    this.tempSrc = ko.observable("");
    this.ad_id = ko.observable("");
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.initEditAd = initEditAd;
    this.setValid = setValid;
}
var vm = new viewModel()
    ,xhr = new XMLHttpRequest()
    ,date = new Date()
    ,dialog = "";
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("adMain"));
    loadAdList();
    document.onkeydown = function(event){
        e = event ? event :(window.event ? window.event : null);
        if(e.keyCode==13){
            subLoadAdList();
            return false;
        }
    }
    $('select').material_select();
});