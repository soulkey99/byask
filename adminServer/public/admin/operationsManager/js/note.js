/**
 * Created by hjy on 2016/8/15 0015.
 */

function loadNoteList(){
    var postObj = {
        phone: $("#u_phone").val(),
        type: $("#u_type").val(),
        status: $("#u_status").val(),
        start: (vm.startPosNote()-1)*vm.pageSizeNote()+1,
        limit: vm.pageSizeNote()
    };
    util.callServerFunction({},"notes",postObj, function (data) {
        if(data.code == 900){
            vm.noteList([]);
            if(data.list.length > 0){
                vm.noteList(data.list);
            }else if (vm.startPosNote() != 1) {
                vm.startPosNote(vm.startPosNote() - 1);
                loadNoteList();
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

function subLoadNoteList(){
    vm.startPosNote(1);
    vm.pageSizeNote(15);
    loadNoteList();
}

function prevPageNote(){
    if(vm.startPosNote()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosNote(vm.startPosNote()-1);
        loadNoteList();
    }
}

function nextPageNote(){
    if(vm.noteList().length == 15){
        vm.startPosNote(vm.startPosNote()+1);
        loadNoteList();
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

function showNoteDetail(){
    util.callServerFunction({},"note/"+ this.note_id, {}, function (data) {
        if(data.code == 900){
            var html = "<ul class='collection'>"+
                "<li class='collection-item'>"+
                "<div>小纸条创建时间</div>"+
                "<div>"+ util.convertTime2Str(data.info.createdAt) +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>小纸条更新时间</div>"+
                "<div>"+ util.convertTime2Str(data.info.updatedAt) +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>小纸条偷听数量</div>"+
                "<div>"+ data.listen +"</div>"+
                "</li>"+
                "<li class='collection-item'>"+
                "<div>小纸条内容</div>"+
                "<div>"+ data.info.content +"</div>"+
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
    this.noteList = ko.observableArray();
    this.startPosNote = ko.observable(1);
    this.pageSizeNote = ko.observable(15);
    this.prevPageNote = prevPageNote;
    this.nextPageNote = nextPageNote;
    this.showNoteDetail = showNoteDetail;
}

var vm = new viewModel()
    ,dialog = "";
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("noteManager"));
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            subLoadNoteList();
            return false;
        }
    }
    loadNoteList();
    $('select').material_select();
});