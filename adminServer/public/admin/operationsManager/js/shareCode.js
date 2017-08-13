/**
 * Created by hjy on 2016/8/22 0022.
 */

function loadShareCodeList(){
    var postObj = {
        key: $("#key").val(),
        startAt: new Date($("#startTime").val()).getTime(),
        endAt: new Date($("#endTime").val()).getTime(),
        start: (vm.startPosShareCode()-1)*vm.pageSizeShareCode()+1,
        limit: vm.pageSizeShareCode()
    };
    util.callServerFunction({},"shareCode",postObj, function (data) {
        if(data.code == 900){
            vm.shareCodeList([]);
            if(data.list.length > 0){
                vm.shareCodeList(data.list);
            }else if (vm.startPosShareCode() != 1) {
                vm.startPosShareCode(vm.startPosShareCode() - 1);
                loadShareCodeList();
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

function subLoadShareCodeList(){
    vm.startPosShareCode(1);
    vm.pageSizeShareCode(15);
    loadShareCodeList();
}

function prevPageShareCode(){
    if(vm.startPosShareCode()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosShareCode(vm.startPosShareCode()-1);
        loadShareCodeList();
    }
}

function nextPageShareCode(){
    if(vm.shareCodeList().length == 15){
        vm.startPosShareCode(vm.startPosShareCode()+1);
        loadShareCodeList();
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

function initAddShareCode(){
    vm.shareCode("");
    var html = "<div class='input-field col s12'>"+
        "<label>分享码描述</label><input type='text' class='validate' id='desc'>"+
        "</div>"+
        "<button class='btn' onclick='subShareCode()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加分享码',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
}

function subShareCode(){
    if($("#desc").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写分享码描述！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var apiName = "shareCode";
        if(vm.shareCode() != ""){
            apiName = "shareCode/"+vm.shareCode();
        }
        util.callServerFunction({}, apiName, {"desc": $("#desc").val()}, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('操作成功！', 3000);
                dialog.close();
                subLoadShareCodeList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function initEditShareCode(){
    vm.shareCode(this.shareCode);
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>分享码描述</label><input type='text' class='validate' id='desc' value='"+ this.desc +"'>"+
        "</div>"+
        "<button class='btn' onclick='subShareCode()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑分享码',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
}

function initShareCodeDetail(){
    vm.shareCode(this.shareCode);
    util.callServerFunction({},"shareCode/"+ vm.shareCode() +"/stat",{}, function (data) {
        if(data.code == 900){
            var html = "<div id='detailDiv'>" +
                "<div class='row'>" +
                "<div class='chip'>分享点击量："+ data.stat.count +"</div>" +
                "<div class='chip'>填写手机号总量："+ data.stat.total +"</div>" +
                "<div class='chip'>新手机号总量："+ data.stat.new +"</div>" +
                "<div class='chip'>新注册手机号总量："+ data.stat.reg +"</div>" +
                "</div>" +
                "<div class='row'>" +
                "<div class='input-field col l3'>" +
                "<input id='detailStartTime' type='text'>" +
                "<label for='detailStartTime' class=''>开始时间</label>" +
                "</div>" +
                "<div class='input-field col l3'>" +
                "<input id='detailEndTime' type='text'>" +
                "<label for='detailEndTime' class=''>结束时间</label>" +
                "</div>" +
                "<div class='input-field col l3'>"+
                "<select id='detailType'>"+
                "<option value=''>全部</option>"+
                "<option value='new'>推广新用户</option>"+
                "<option value='reg'>推广注册新用户</option>"+
                "</select>"+
                "<label for='detailType'>推广用户类型</label>" +
                "</div>"+
                "<div class='input-field col l3'>" +
                "<a class='waves-effect waves-light btn' href='javascript:subSearchShareDetail()'>检 索</a>" +
                "</div>" +
                "</div>" +
                "<table class='bordered highlight responsive-table'>" +
                "<thead>" +
                "<tr>" +
                "<th align='center'>序号</th>" +
                "<th align='center'>手机号</th>" +
                "<th align='center'>点击量</th>" +
                "<th align='center'>是/否新手机号</th>" +
                "<th align='center'>是/否注册</th>" +
                "<th align='center'>注册时间</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody data-bind='foreach: shareDetailList'>" +
                "<tr>" +
                "<td align='center'><span data-bind='text: $index()+1'></span></td>" +
                "<td align='left'><span data-bind='text: phone'></span></td>" +
                "<td align='left'><span data-bind='text: count'></span></td>" +
                "<td align='left'><span data-bind=\"text: $data.new==true?'是':'否'\"></span></td>" +
                "<td align='left'><span data-bind=\"text: reg==true?'是':'否'\"></span></td>" +
                "<td align='left'><span data-bind='text: util.convertTime2Str(regAt)'></span></td>" +
                "</tr>" +
                "</tbody>" +
                "</table>" +
                "<div align='center'>" +
                "<ul class='pagination'>" +
                "<li class='waves-effect'><a href='#!' data-bind='click:prevPageShareDetail'><i class='material-icons'>chevron_left</i></a></li>" +
                "<li class='active'><a href='javascript:void(0)' data-bind='text: startPosShareDetail'>1</a></li>" +
                "<li class='waves-effect'><a href='#!' data-bind='click:nextPageShareDetail'><i class='material-icons'>chevron_right</i></a></li>" +
                "</ul>" +
                "</div>" +
                "</div>";
            var dialogPoint = $.dialog({
                title: vm.shareCode() + "-推广统计",
                content: html,
                theme: "material",
                columnClass: "col l6 offset-l3 s12"
            });
            $('select').material_select();
            $('#detailStartTime').datetimepicker({format: 'Y-m-d H:i:s'});
            $('#detailEndTime').datetimepicker({format: 'Y-m-d H:i:s'});
            ko.applyBindings(vm,document.getElementById("detailDiv"));
            searchShareDetail();
        }else{
            util.errorCodeApi(data);
        }
    },"GET")
}

function searchShareDetail(){
    var postObj = {
        type: $("#detailType").val(),
        start: (vm.startPosShareDetail()-1)*vm.pageSizeShareDetail()+1,
        limit: vm.pageSizeShareDetail()
    };
    if($("#detailStartTime").val() != ""){
        postObj.startAt = new Date($("#detailStartTime").val()).getTime()
    }
    if($("#detailEndTime").val() != ""){
        postObj.endAt = new Date($("#detailEndTime").val()).getTime()
    }
    util.callServerFunction({},"shareCode/"+ vm.shareCode() +"/list",postObj, function (data) {
        if(data.code == 900){
            vm.shareDetailList([]);
            if(data.list.length > 0){
                vm.shareDetailList(data.list);
            }else if (vm.startPosShareDetail() != 1) {
                vm.startPosShareDetail(vm.startPosShareDetail() - 1);
                searchShareDetail();
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

function subSearchShareDetail(){
    vm.startPosShareCode(1);
    vm.pageSizeShareCode(15);
    searchShareDetail();
}

function prevPageShareDetail(){
    if(vm.startPosShareDetail()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosShareDetail(vm.startPosShareDetail()-1);
        searchShareDetail();
    }
}

function nextPageShareDetail(){
    if(vm.shareDetailList().length == 15){
        vm.startPosShareDetail(vm.startPosShareDetail()+1);
        searchShareDetail();
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

function showQRcode(){
    window.open('https://cli.im/api/qrcode/code?text='+this.link,'二维码','height=500,width=500,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no, status=no');
}

var viewModel = function () {
    this.shareCodeList = ko.observableArray();
    this.startPosShareCode = ko.observable(1);
    this.pageSizeShareCode = ko.observable(15);
    this.shareCode = ko.observable("");
    this.prevPageShareCode = prevPageShareCode;
    this.nextPageShareCode = nextPageShareCode;
    this.initEditShareCode = initEditShareCode;
    this.initShareCodeDetail = initShareCodeDetail;

    this.searchShareDetail = searchShareDetail;
    this.shareDetailList = ko.observableArray();
    this.startPosShareDetail = ko.observable(1);
    this.pageSizeShareDetail = ko.observable(15);
    this.prevPageShareDetail = prevPageShareDetail;
    this.nextPageShareDetail = nextPageShareDetail;
}
var vm = new viewModel()
    ,date = new Date()
    ,dialog = "";
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("shareCodeManager"));
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            subLoadShareCodeList();
            return false;
        }
    }
    loadShareCodeList();
    $('select').material_select();
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
});
