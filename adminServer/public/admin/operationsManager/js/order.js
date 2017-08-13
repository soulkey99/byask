/**
 * Created by hjy on 2016/8/15 0015.
 */

function loadOrderList(){
    var postObj = {
        phone: $("#u_phone").val(),
        type: $("#u_type").val(),
        status: $("#u_status").val(),
        start: (vm.startPosOrder()-1)*vm.pageSizeOrder()+1,
        limit: vm.pageSizeOrder()
    };
    util.callServerFunction({},"orders",postObj, function (data) {
        if(data.code == 900){
            vm.orderList([]);
            if(data.list.length > 0){
                vm.orderList(data.list);
            }else if (vm.startPosOrder() != 1) {
                vm.startPosOrder(vm.startPosOrder() - 1);
                loadOrderList();
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

function subLoadOrderList(){
    vm.startPosOrder(1);
    vm.pageSizeOrder(15);
    loadOrderList();
}

function prevPageOrder(){
    if(vm.startPosOrder()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosOrder(vm.startPosOrder()-1);
        loadOrderList();
    }
}

function nextPageOrder(){
    if(vm.orderList().length == 15){
        vm.startPosOrder(vm.startPosOrder()+1);
        loadOrderList();
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

function showOrderDetail(){
    util.callServerFunction({},"order/"+ this.o_id, {}, function (data) {
        if(data.code == 900){
            var html = "<ul class='collection'>"+
                "<li class='collection-item'>"+
                "<div>订单创建时间</div>"+
                "<div>"+ util.convertTime2Str(data.info.createdAt) +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>订单更新时间</div>"+
                "<div>"+ util.convertTime2Str(data.info.updatedAt) +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>订单价格</div>"+
                "<div>"+ data.info.price +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>订单内容</div>"+
                "<div>"+ data.info.question +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>订单评价</div>"+
                "<div>"+ data.info.rating +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>提交订单方式</div>"+
                "<div>"+ data.info.type +"</div>"+
                "</li>"+
                "</ul>";
            dialog = $.dialog({
                backgroundDismiss: true,
                icon: "icon icon-document",
                title: "专家审核",
                content: html,
                theme: "material",
                columnClass: "col l6 offset-l3 s12"
            });
        }else{
            util.errorCodeApi(data);
        }
    },"GET")
}

var viewModel = function () {
    this.orderList = ko.observableArray();
    this.startPosOrder = ko.observable(1);
    this.pageSizeOrder = ko.observable(15);
    this.prevPageOrder = prevPageOrder;
    this.nextPageOrder = nextPageOrder;
    this.showOrderDetail = showOrderDetail;
}

var vm = new viewModel()
    ,dialog = "";
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("orderManager"));
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            subLoadOrderList();
            return false;
        }
    }
    loadOrderList();
    $('select').material_select();
});