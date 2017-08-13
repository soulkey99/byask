/**
 * Created by hjy on 2016/8/31 0031.
 */

function loadAdminList(){
    util.callServerFunction({},'admin/list?random='+parseInt(Math.random()*10000), {start: (vm.startPos()-1)*vm.pageSize()+1, limit: vm.pageSize()}, function(data) {
        if(data.code == 900){
            vm.adminList([]);
            if(data.list.length > 0){
                vm.adminList(data.list);
            }else if(vm.startPos() != 1){
                vm.startPos(vm.startPos()-1);
                loadAdminList();
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
        loadAdminList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadAdminList();
}

function subLoadAdminList(){
    vm.startPos(1);
    vm.pageSize(15);
    loadAdminList();
}

function initAddAdmin(){
    vm.admin_id("");
    var html ="<div class='input-field col s12'>"+
        "<label>用户名</label><input type='text' class='validate' id='userName'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>密码</label><input type='text' class='validate' id='passwd'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='adminType'>"+
        "<option value='super'>超级管理员</option>"+
        "<option value='admin'>普通管理员</option>"+
        "</select>"+
        "<label for='adType'>管理员类型</label>" +
        "</div>"+
        "<div class='col s12'>"+
        "<label>授权区域</label><br>" +
        "<div class='row'>" +
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='expertAudit' id='expertAuditC'><label for='expertAuditC' style='margin-right: 10px'>专家审核</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='indexBanner' id='indexBannerC'><label for='indexBannerC' style='margin-right: 10px'>首页Banner管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='ad' id='adC'><label for='adC' style='margin-right: 10px'>广告管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='indexClassification' id='indexClassificationC'><label for='indexClassificationC' style='margin-right: 10px'>首页分类管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='indexRecommend' id='indexRecommendC'><label for='indexRecommendC' style='margin-right: 10px'>首页推荐管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='user' id='userC'><label for='userC' style='margin-right: 10px'>用户管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='log' id='logC'><label for='logC' style='margin-right: 10px'>日志管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='order' id='orderC'><label for='orderC' style='margin-right: 10px'>订单管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='note' id='noteC'><label for='noteC' style='margin-right: 10px'>小纸条管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='withdraw' id='withdrawC'><label for='withdrawC' style='margin-right: 10px'>提现管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='userFeedback' id='userFeedbackC'><label for='userFeedbackC' style='margin-right: 10px'>用户反馈管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='shareCode' id='shareCodeC'><label for='shareCodeC' style='margin-right: 10px'>分享码管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='admin' id='adminC'><label for='adminC' style='margin-right: 10px'>管理员管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='onlineConfig' id='onlineConfigC'><label for='onlineConfigC' style='margin-right: 10px'>在线参数管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='update' id='updateC'><label for='updateC' style='margin-right: 10px'>更新管理</label></div>"+
        "</div>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>备注</label><input type='text' class='validate' id='remark'>"+
        "</div>"+
        "<button class='btn' onclick='uploadAdmin()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加管理员',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
}

function uploadAdmin(){
    if($("#userName").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写用户名！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#passwd").val() == "" && vm.admin_id() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写密码！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else {
        var sectionList = [], apiName = "admin";
        $("input[name='sections']").each(function(){
            if($(this).prop("checked")){
                sectionList.push($(this).val());
            }
        });
        if(vm.admin_id() != ""){
            apiName = "admin/"+vm.admin_id();
        }
        var postObj = {
            userName: $("#userName").val(),
            passwd: $("#passwd").val(),
            remark: $("#remark").val(),
            type: $("#adminType").val(),
            sections: JSON.stringify(sectionList)
        };
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('添加成功', 3000);
                dialog.close();
                loadAdminList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function initEditAdmin(){
    vm.admin_id(this.userID);
    var html ="<div class='input-field col s12'>"+
        "<label class='active'>用户名</label><input type='text' class='validate' id='userName' value='"+ this.userName +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>密码</label><input type='text' class='validate' id='passwd' placeholder='如需修改密码请填写新密码'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='adminType'>"+
        "<option value='super'>超级管理员</option>"+
        "<option value='admin'>普通管理员</option>"+
        "</select>"+
        "<label for='adType'>管理员类型</label>" +
        "</div>"+
        "<div class='col s12'>"+
        "<label>授权区域</label><br>" +
        "<div class='row'>" +
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='expertAudit' id='expertAuditC'><label for='expertAuditC' style='margin-right: 10px'>专家审核</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='indexBanner' id='indexBannerC'><label for='indexBannerC' style='margin-right: 10px'>首页Banner管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='ad' id='adC'><label for='adC' style='margin-right: 10px'>广告管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='indexClassification' id='indexClassificationC'><label for='indexClassificationC' style='margin-right: 10px'>首页分类管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='indexRecommend' id='indexRecommendC'><label for='indexRecommendC' style='margin-right: 10px'>首页推荐管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='user' id='userC'><label for='userC' style='margin-right: 10px'>用户管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='log' id='logC'><label for='logC' style='margin-right: 10px'>日志管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='order' id='orderC'><label for='orderC' style='margin-right: 10px'>订单管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='note' id='noteC'><label for='noteC' style='margin-right: 10px'>小纸条管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='withdraw' id='withdrawC'><label for='withdrawC' style='margin-right: 10px'>提现管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='userFeedback' id='userFeedbackC'><label for='userFeedbackC' style='margin-right: 10px'>用户反馈管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='shareCode' id='shareCodeC'><label for='shareCodeC' style='margin-right: 10px'>分享码管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='admin' id='adminC'><label for='adminC' style='margin-right: 10px'>管理员管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='onlineConfig' id='onlineConfigC'><label for='onlineConfigC' style='margin-right: 10px'>在线参数管理</label></div>"+
        "<div class='col l4 s4'><input type='checkbox' name='sections' value='update' id='updateC'><label for='updateC' style='margin-right: 10px'>更新管理</label></div>"+
        "</div>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>备注</label><input type='text' class='validate' id='remark' value='"+ this.remark +"'>"+
        "</div>"+
        "<button class='btn' onclick='uploadAdmin()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加管理员',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    for(var i=0;i<this.sections.length;i++){
        $("input[value='"+ this.sections[i] +"']").prop("checked","true");
    }
    $(".adminType").val(this.type);
    $('select').material_select();
}

var viewModel = function() {
    this.adminList = ko.observableArray();
    this.admin_id = ko.observable("");
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.initEditAdmin = initEditAdmin;
};
var vm = new viewModel()
    ,dialog = null;
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("adminDiv"));
    $('select').material_select();
    subLoadAdminList();
});