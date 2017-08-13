/**
 * Created by hjy on 2016/8/16 0016.
 */

function loadWithdrawList(){
    var postObj = {
        phone: $("#phone").val(),
        status: $("#status").val(),
        startAt: new Date($("#startTime").val()).getTime(),
        endAt: new Date($("#endTime").val()).getTime(),
        start: (vm.startPosWithdraw()-1)*vm.pageSizeWithdraw()+1,
        limit: vm.pageSizeWithdraw()
    };
    util.callServerFunction({},"user/withdraw	",postObj, function (data) {
        if(data.code == 900){
            if(data.list.length > 0){
                vm.withdrawList([]);
                for(var i=0;i<data.list.length;i++){
                    data.list[i].statusOptions = [
                        {"text": "进行中","value": "pending"},
                        {"text": "提现成功","value": "paid"},
                        {"text": "提现失败","value": "fail"}
                    ];
                    vm.withdrawList.push(data.list[i]);
                }
                $('select').material_select();
            }else if (vm.startPosWithdraw() != 1) {
                vm.startPosWithdraw(vm.startPosWithdraw() - 1);
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

function subLoadWithdrawList(){
    vm.startPosWithdraw(1);
    vm.pageSizeWithdraw(15);
    loadWithdrawList();
}

function prevPageWithdraw(){
    if(vm.startPosWithdraw()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosWithdraw(vm.startPosWithdraw()-1);
        loadWithdrawList();
    }
}

function nextPageWithdraw(){
    if(vm.withdrawList().length == 15){
        vm.startPosWithdraw(vm.startPosWithdraw()+1);
        loadWithdrawList();
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

function changeStatus(){
    var postObj = {
        status: this.status
    };
    util.callServerFunction({},"user/withdraw	/"+this.withdraw_id ,postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功', 3000);
            loadWithdrawList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

var viewModel = function () {
    this.withdrawList = ko.observableArray();
    this.startPosWithdraw = ko.observable(1);
    this.pageSizeWithdraw = ko.observable(15);
    this.prevPageWithdraw = prevPageWithdraw;
    this.nextPageWithdraw = nextPageWithdraw;
    this.changeStatus = changeStatus;
}
var vm = new viewModel()
    ,date = new Date()
    ,dialog = "";
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("withdrawManager"));
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            subLoadWithdrawList();
            return false;
        }
    }
    loadWithdrawList();
    $('select').material_select();
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
});
