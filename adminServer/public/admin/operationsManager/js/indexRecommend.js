/**
 * Created by hjy on 2016/8/11 0011.
 */

function loadIndexRecommendList(){
    var postObj = {
        start: (vm.startPos()-1)*vm.pageSize()+1,
        limit: vm.pageSize(),
        valid: $("#valid").val()
    };
    util.callServerFunction({},'recommends', postObj, function(resp){
        if(resp.code == 900){
            vm.indexRecommendList([]);
            if (resp.list.length > 0) {
                vm.indexRecommendList(resp.list);
            }else if (vm.startPos() != 1) {
                vm.startPos(vm.startPos() - 1);
                loadIndexRecommendList();
                $.dialog({
                    title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
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
            title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPos(vm.startPos()-1);
        loadIndexRecommendList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadIndexRecommendList();
}

function prevPageNote(){
    if(vm.startPosNote()==1){
        $.dialog({
            title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosNote(vm.startPosNote()-1);
        searchNote();
    }
}

function nextPageNote(){
    vm.startPosNote(vm.startPosNote()+1);
    searchNote();
}

function subLoadIndexRecommendList(){
    vm.startPos(1);
    vm.pageSize(15);
    loadIndexRecommendList();
}

function setValid(){
    var recommend_id = this.recommend_id
    var postObj = {
        valid: !this.valid
    };
    util.callServerFunction({},'recommend/'+ recommend_id, postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadIndexRecommendList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

function initAddRecommend(){
    var html = "<div class='input-field col s12'>"+
        "<label>有效时间</label>" +
        "<input id='startTime' type='text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>失效时间</label>" +
        "<input id='endTime' type='text'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='validAdd'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='true'>有效</option>"+
        "<option value='false'>无效</option>"+
        "</select>"+
        "<label for='actionType'>是否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='category' onchange='changeInfo(this)'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='hot'>热门用户</option>"+
        "<option value='hotNote'>热门纸条</option>"+
        "</select>"+
        "<label for='actionType'>推荐分类</label>" +
        "</div>"+
        "<div class='input-field col s12' id='expert'>"+
        "<button class='btn' onclick='selectExpert()'>选择专家</button>" +
        "<input id='dest' type='hidden'>"+
        "</div>"+
        "<div class='input-field col s12' id='note'>"+
        "<button class='btn' onclick='selectNote()'>选择纸条</button>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>备注</label><input type='text' class='validate' id='remark'>"+
        "</div>"+
        "<button class='btn' onclick='uploadRecommend()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑首页热门推荐',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#expert,#note").hide();
    $('select').material_select();
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
}

function changeInfo(obj){
    if($(obj).val() == "hot"){
        $("#expert").show();
        $("#note").hide();
    }else{
        $("#expert").hide();
        $("#note").show();
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
        "<th align='center' style='width: 60px'>头像</th>" +
        "<th align='center'>昵称</th>" +
        "<th align='center'>电话</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody data-bind='foreach: expertList'>" +
        "<tr>" +
        "<td align='center'><input type='radio' class='mdl-radio__button' name='expertId' data-bind='click: getSelectExpert'></td>" +
        "<td align='left'><img data-bind='attr: {src: user.avatar}' class='circle responsive-img' style='width: 50px;height: 50px'></td>" +
        "<td align='left'><span data-bind='text: nick'></span></td>" +
        "<td align='left'><span data-bind='text: phone'></span></td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "</div>";
    var dialogPoint = $.dialog({
        title: "添加专家链接",
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    ko.applyBindings(vm,document.getElementById("expertDiv"));
}

function searchExpert(){
    if($("#name").val() == "" && $("#phone").val() == "" && $("#nick").val()==""){
        $.dialog({
            title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
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

function selectNote(){
    vm.expertList("");
    var html = "<div id='noteDiv'>" +
        "<div class='row'>" +
        "<div class='input-field col l3 s6'>" +
        "<input id='phone' type='text'>" +
        "<label for='phone' class=''>手机号</label>" +
        "</div>" +
        "<div class='input-field col l3 s6'>"+
        "<select id='phoneType'>"+
        "<option value='expert'>专家</option>"+
        "<option value=''>用户</option>"+
        "</select>"+
        "<label for='actionType'>用户类型</label>" +
        "</div>"+
        "<div class='input-field col l3 s12'>" +
        "<a class='waves-effect waves-light btn' href='javascript:searchNote()'>检 索</a>" +
        "</div>" +
        "</div>" +
        "<table class='bordered highlight responsive-table'>" +
        "<thead>" +
        "<tr>" +
        "<th align='center'></th>" +
        "<th align='center' style='width: 50%'>纸条内容</th>" +
        "<th align='center'>专家姓名</th>" +
        "<th align='center'>用户昵称</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody data-bind='foreach: noteList'>" +
        "<tr>" +
        "<td align='center'><input type='radio' class='mdl-radio__button' name='expertId' data-bind='click: getSelectNote'></td>" +
        "<td align='left'><span data-bind='text: content'></span></td>" +
        "<td align='left'><span data-bind='text: expert_info.name'></span></td>" +
        "<td align='left'><span data-bind='text: user_info.nick'></span></td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "<div align='center'>" +
        "<ul class='pagination'>" +
        "<li class='waves-effect'><a href='#!' data-bind='click:prevPageNote'><i class='material-icons'>chevron_left</i></a></li>" +
        "<li class='active'><a href='javascript:void(0)' data-bind='text: startPosNote'>1</a></li>" +
        "<li class='waves-effect'><a href='#!' data-bind='click:nextPageNote'><i class='material-icons'>chevron_right</i></a></li>" +
        "</ul>" +
        "</div>" +
        "</div>";
    var dialogPoint = $.dialog({
        title: "添加小纸条链接",
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
    ko.applyBindings(vm,document.getElementById("noteDiv"));
}

function searchNote(){
    if($("#phone").val() == ""){
        $.dialog({
            title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
            content: "请填写检索手机号！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var postObj = {
            phone: $("#phone").val(),
            type: $("#phoneType").val(),
            status: "replied",
            start: (vm.startPosNote()-1)*vm.pageSizeNote()+1,
            limit: vm.pageSizeNote(),
        };
        util.callServerFunction({},"notes	",postObj, function (data) {
            if(data.code == 900){
                vm.noteList([]);
                if(data.list.length <= 0){
                    vm.startPosNote(vm.startPosNote() - 1);
                    searchNote();
                    $.dialog({
                        title: "<i class='material-icons'>error_outline</i><span style='vertical-align: text-top'>提示</span>",
                        content: "您已经在最后一页了！",
                        theme: "material",
                        columnClass: "col l6 offset-l3 s12"
                    })
                }else{
                    vm.noteList(data.list);
                }
            }else{
                util.errorCodeApi(data);
            }
        },"GET")
    }
}

function getSelectExpert(){
    $("#dest").val(this.userID);
    Materialize.toast('选择专家成功!', 3000);
    return true;
}

function getSelectNote(){
    $("#dest").val(this.note_id);
    Materialize.toast('选择小纸条成功!', 3000);
    return true;
}

function uploadRecommend() {
    if ($("#startTime").val() == "") {
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content: "请选择有效时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if ($("#endTime").val() == "") {
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content: "请选择失效时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if ($("#validAdd").val() == "") {
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content: "请选择是否有效！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if ($("#category").val() == "") {
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content: "请选择推荐分类！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if ($("#dest").val() == "") {
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content: "请选择推荐内容！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if ($("#seq").val() == "") {
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content: "请填写显示顺序！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else {
        var postObj = {
            startAt: new Date($("#startTime").val()).getTime(),
            endAt: new Date($("#endTime").val()).getTime(),
            valid: $("#validAdd").val(),
            remark: $("#remark").val(),
            dest: $("#dest").val(),
            category: $("#category").val(),
            seq: $("#seq").val()
        };
        var apiName = "recommend";
        if(vm.recommend_id() != ""){
            apiName += "/" + vm.recommend_id();
        }
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('操作成功', 3000);
                dialog.close();
                subLoadIndexRecommendList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function initEditRecommend(){
    vm.recommend_id(this.recommend_id);
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>有效时间</label>" +
        "<input id='startTime' type='text' value='"+ util.convertTime2Str(this.startAt) +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>失效时间</label>" +
        "<input id='endTime' type='text' value='"+ util.convertTime2Str(this.endAt) +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='validAdd'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='true'>有效</option>"+
        "<option value='false'>无效</option>"+
        "</select>"+
        "<label for='actionType'>是否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='category' onchange='changeInfo(this)'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='hot'>热门用户</option>"+
        "<option value='hotNote'>热门纸条</option>"+
        "</select>"+
        "<label for='actionType'>推荐分类</label>" +
        "</div>"+
        "<div class='input-field col s12' id='expert'>"+
        "<button class='btn' onclick='selectExpert()'>选择专家</button>" +
        "<input id='dest' type='hidden'>"+
        "</div>"+
        "<div class='input-field col s12' id='note'>"+
        "<button class='btn' onclick='selectNote()'>选择纸条</button>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>备注</label><input type='text' class='validate' id='remark'>"+
        "</div>"+
        "<button class='btn' onclick='uploadRecommend()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑首页热门推荐',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    if(this.category == "hot"){
        $("#expert").show();
        $("#note").hide();
    }else{
        $("#expert").hide();
        $("#note").show();
    }
    $("#validAdd").val(this.valid+"");
    $("#category").val(this.category);
    $("#seq").val(this.seq);
    $("#remark").val(this.remark);
    $('select').material_select();
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
}

var viewModel = function() {
    this.indexRecommendList = ko.observableArray();
    this.expertList = ko.observableArray();
    this.noteList = ko.observableArray();
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;

    this.startPosNote = ko.observable(1);
    this.pageSizeNote = ko.observable(15);
    this.prevPageNote = prevPageNote;
    this.nextPageNote = nextPageNote;

    this.initEditRecommend = initEditRecommend;
    this.setValid = setValid;
    this.getSelectExpert = getSelectExpert;
    this.getSelectNote = getSelectNote;
    this.recommend_id = ko.observable("");
}
var vm = new viewModel();
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("indexRecommendMain"));
    loadIndexRecommendList();
    document.onkeydown = function(event){
        e = event ? event :(window.event ? window.event : null);
        if(e.keyCode==13){
            subLoadIndexRecommendList();
            return false;
        }
    }
    $('select').material_select();
    $.datetimepicker.setLocale("ch");
});