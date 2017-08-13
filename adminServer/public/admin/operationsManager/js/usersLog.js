/**
 * Created by hjy on 2016/8/24 0024.
 */

function loadLogList(){
    var postObj = {
        phone: $("#phone").val(),
        imei: $("#imei").val(),
        mac: $("#mac").val(),
        ip: $("#ip").val(),
        platform: $("#platform").val(),
        action: $("#action").val(),
        client: $("#client").val(),
        channel: $("#channel").val(),
        startAt: $("#startAt").val()==''?'':new Date($("#startAt").val()).toJSON(),
        endAt: $("#endAt").val()==''?'':new Date($("#endAt").val()).toJSON(),
        start: (vm.startPosLog()-1)*vm.pageSizeLog()+1,
        limit: vm.pageSizeLog()
    };
    util.callServerFunction({},"user/logs",postObj, function (data) {
        if(data.code == 900){
            vm.logList([]);
            if(data.list.length > 0){
                vm.logList(data.list);
            }else if (vm.startPosLog() != 1) {
                vm.startPosLog(vm.startPosLog() - 1);
                loadWithdrawList();
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

function subLoadLogList(){
    vm.startPosLog(1);
    vm.pageSizeLog(15);
    loadLogList();
}

function prevPageLog(){
    if(vm.startPosLog()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosLog(vm.startPosLog()-1);
        loadLogList();
    }
}

function nextPageLog(){
    if(vm.logList().length == 15){
        vm.startPosLog(vm.startPosLog()+1);
        loadLogList();
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

var viewModel = function () {
    this.logList = ko.observableArray();
    this.startPosLog = ko.observable(1);
    this.pageSizeLog = ko.observable(15);
    this.prevPageLog = prevPageLog;
    this.nextPageLog = nextPageLog;
}
var vm = new viewModel()
    ,dialog = "";
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("logManager"));
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            subLoadLogList();
            return false;
        }
    }
    loadLogList();
    $('select').material_select();
    $.datetimepicker.setLocale("ch");
    $('#startAt').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endAt').datetimepicker({format: 'Y-m-d H:i:s'});
});