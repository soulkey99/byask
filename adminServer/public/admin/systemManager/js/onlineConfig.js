/**
 * Created by hjy on 2016/7/19 0019.
 */

function loadOnlineConfigList(){
    util.callServerFunction({},'onlineConfig?random='+parseInt(Math.random()*10000), {start: (vm.startPos()-1)*vm.pageSize()+1, limit: vm.pageSize()}, function(data) {
        if(data.code == 900){
            vm.onlineConfigList([]);
            if(data.list.length > 0){
                vm.onlineConfigList(data.list);
            }else if(vm.startPos() != 1){
                vm.startPos(vm.startPos()-1);
                loadOnlineConfigList();
                $.dialog({
                    icon: 'icon icon-warning',
                    title: '提示信息',
                    content:"您已经在最后一页了！",
                    theme: "material",
                    columnClass: "col l6 offset-l3 s12"
                })
            }
        }else{
            util.errorCodeApi(data);
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
        loadOnlineConfigList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadOnlineConfigList();
}

function setValid(){
    var postObj = {
        valid: !this.valid
    };
    util.callServerFunction({},'onlineConfig/'+this.config_id, postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadOnlineConfigList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

function initOnlineConfig(){
    vm.config_id(this.config_id);
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>参数名称</label>"+
        "<input type='text' disabled value='"+ this.key +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>参数值</label><input type='text' id='configValue' value='"+ this.value +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>参数描述</label><input type='text' id='configDesc' value='"+ this.desc +"'>"+
        "</div>"+
        "<button class='btn btn-default' onclick='updateConfig()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-document-edit",
        title: '编辑在线参数',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
}

function updateConfig(){
    var postObj = {
        value: $("#configValue").val(),
        desc: $("#configDesc").val()
    };
    util.callServerFunction({},'onlineConfig/'+vm.config_id(), postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            dialog.close();
            loadOnlineConfigList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

function initAddOnlineConfig(){
    var html = "<div class='input-field col s12'>"+
        "<label>参数名称</label><input type='text' id='configKey' value=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>参数值</label><input type='text' id='configValue' value=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>参数平台</label>" +
        "<select id='configPlatform'>"+
        "<option value=''>-请选择-</option>"+
        "<option value='android'>android</option>"+
        "<option value='ios'>ios</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>参数描述</label><input type='text' id='configDesc' value=''>"+
        "</div>"+
        "<button class='btn btn-default' onclick='addConfig()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加在线参数',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
}

function addConfig(){
    if($("#configKey").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写参数名称！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#configValue").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写参数值！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#configPlatform").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择参数平台！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var postObj = {
            key: $("#configKey").val(),
            value: $("#configValue").val(),
            desc: $("#configDesc").val(),
            platform: $("#configPlatform").val()
        };
        util.callServerFunction({},'onlineConfig/'+vm.config_id(), postObj, function (data) {
            if(data.code == 900){
                Materialize.toast('操作成功!', 3000);
                dialog.close();
                loadOnlineConfigList();
            }else{
                util.errorCodeApi(data);
            }
        },"POST")
    }
}

var viewModel = function() {
    this.onlineConfigList = ko.observableArray();
    this.config_id = ko.observable("");
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.setValid = setValid;
    this.initOnlineConfig = initOnlineConfig;
    this.initAddOnlineConfig = initAddOnlineConfig;
};
var vm = new viewModel()
    ,dialog = null;
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("onlineConfigDiv"));
    loadOnlineConfigList();
});