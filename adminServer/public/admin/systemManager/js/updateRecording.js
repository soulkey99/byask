/**
 * Created by hjy on 2016/8/18 0018.
 */

function loadUpdateList(){
    var postObj = {
        platform: $("#platform").val(),
        start: (vm.startPosUpdate()-1)*vm.pageSizeUpdate()+1,
        limit: vm.pageSizeUpdate()
    };
    util.callServerFunction({},"update	",postObj, function (data) {
        if(data.code == 900){
            vm.updateList([]);
            if(data.list.length > 0){
                vm.updateList(data.list);
            }else if (vm.startPosUpdate() != 1) {
                vm.startPosUpdate(vm.startPosUpdate() - 1);
                loadUpdateList();
                $.dialog({
                    title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
                    content: "您已经在最后一页了！",
                    theme: "material",
                    columnClass: "col l6 offset-l3 s12"
                })
            }
        }else{
            util.errorCodeApi(data);
        }
    },"GET")
}

function subLoadUpdateList(){
    vm.startPosUpdate(1);
    vm.pageSizeUpdate(15);
    loadUpdateList();
}

function prevPageUpdate(){
    if(vm.startPosUpdate()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosUpdate(vm.startPosUpdate()-1);
        loadUpdateList();
    }
}

function nextPageUpdate(){
    if(vm.UpdateList().length == 15){
        vm.startPosUpdate(vm.startPosUpdate()+1);
        loadUpdateList();
    }else{
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第最后一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }
}

function initAddUpdate(){
    vm.update_id("");
    var html = "<div class='input-field col s12'>"+
        "<label>版本号</label><input type='text' id='version'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>版本序号</label><input type='text' id='code'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>平台</label>" +
        "<select id='platformUpdate'>"+
        "<option value='android'>android</option>"+
        "<option value='ios'>ios</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>" +
        "<div class='btn' onclick='selectFile()'>"+
        "<span>上传更新文件</span>"+
        "<span id='loading' style='margin-left: 10px'></span>"+
        "</div>"+
        "<input type='file' id='fileUrl' onchange='uploadFile()' style='display: none'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>下载链接</label><input type='text' id='url'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>更新描述</label><input type='text' id='desc'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>是否启用</label>" +
        "<select id='valid'>"+
        "<option value='true'>启用</option>"+
        "<option value='false'>停用</option>"+
        "</select>"+
        "</div>"+
        "<button class='btn btn-default' onclick='subUpdate()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加更新',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
}

function selectFile(){
    $("#fileUrl").click();
}

function uploadFile(){
    if($("#version").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写版本号！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var fd = new FormData();
        fd.append("upload", $("#fileUrl")[0].files[0]);
        fd.append("path", "soft/CallTalent_release_v"+ $("#version").val() +".apk");
        fd.append("vendor", "local");
        fd.append("overwrite", "true");
        xhr.open('POST', 'http://test.soulkey99.com:8067/upload', true);
        xhr.onreadystatechange = upLoadFileCallBack;
        //侦查当前附件上传情况
        xhr.upload.onprogress = function(evt){
            var loaded = evt.loaded;
            var tot = evt.total;
            var per = Math.floor(100*loaded/tot);
            $("#loading").text(per+"%");
        }
        xhr.send(fd);
    }
}

function upLoadFileCallBack(){
    if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
        $("#url").val(JSON.parse(xhr.response).filePath);
        $("#url").focus();
    }
}

function subUpdate(){
    if($("#version").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写版本号！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#code").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写版本序号！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#platformUpdate").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择平台！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#url").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写下载链接！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var postObj = {
            version: $("#version").val(),
            code: $("#code").val(),
            platform: $("#platformUpdate").val(),
            url: $("#url").val(),
            desc: $("#desc").val(),
            valid: $("#valid").val()
        };
        var apiName = "update";
        if(vm.update_id() != ""){
            apiName = "update/"+vm.update_id();
        }
        util.callServerFunction({},apiName, postObj, function (data) {
            if(data.code == 900){
                Materialize.toast('操作成功!', 3000);
                dialog.close();
                loadUpdateList();
            }else{
                util.errorCodeApi(data);
            }
        },"POST")
    }
}

function initEditUpdate(){
    vm.update_id(this.update_id);
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>版本号</label><input type='text' id='version' value='"+ this.version +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>版本序号</label><input type='text' id='code' value='"+ this.code +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>平台</label>" +
        "<select id='platformUpdate'>"+
        "<option value='android'>android</option>"+
        "<option value='ios'>ios</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>" +
        "<div class='btn' onclick='selectFile()'>"+
        "<span>上传更新文件</span>"+
        "<span id='loading' style='margin-left: 10px'></span>"+
        "</div>"+
        "<input type='file' id='fileUrl' onchange='uploadFile()' style='display: none'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>下载链接</label><input type='text' id='url' value='"+ this.url +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>更新描述</label><input type='text' id='desc' value='"+ this.desc +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>是否启用</label>" +
        "<select id='valid'>"+
        "<option value='true'>启用</option>"+
        "<option value='false'>停用</option>"+
        "</select>"+
        "</div>"+
        "<button class='btn btn-default' onclick='subUpdate()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加更新',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#platformUpdate").val(this.platform);
    $("#valid").val(this.valid+"");
    $('select').material_select();
}

function setValid(){
    var postObj = {
        valid: !this.valid
    };
    util.callServerFunction({},'update/'+this.update_id, postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadUpdateList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

var viewModel = function () {
    this.updateList = ko.observableArray();
    this.startPosUpdate = ko.observable(1);
    this.pageSizeUpdate = ko.observable(15);
    this.update_id = ko.observable("");
    this.prevPageUpdate = prevPageUpdate;
    this.nextPageUpdate = nextPageUpdate;
    this.initEditUpdate = initEditUpdate;
    this.setValid = setValid;
}
var vm = new viewModel()
    ,dialog = ""
    ,xhr = new XMLHttpRequest();
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("updateManager"));
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            subLoadUpdateList();
            return false;
        }
    }
    loadUpdateList();
    $('select').material_select();
});