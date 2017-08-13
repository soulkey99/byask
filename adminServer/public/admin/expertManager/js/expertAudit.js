/**
 * Created by hjy on 2016/7/11 0011.
 */

function loadExpertList(){
    util.callServerFunction({},'expert/apply?random='+parseInt(Math.random()*10000), {start: (vm.startPos()-1)*vm.pageSize()+1, limit: vm.pageSize()}, function(data) {
        if(data.code == 900){
            vm.expertList([]);
            if(data.list.length > 0){
                vm.expertList(data.list);
            }else if(vm.startPos() != 1){
                vm.startPos(vm.startPos()-1);
                loadExpertList();
                $.dialog({
                    backgroundDismiss: true,
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
            backgroundDismiss: true,
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPos(vm.startPos()-1);
        loadExpertList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadExpertList();
}

function initExpertAudit(){
    vm.apply_id(this.apply_id);
    var html = "<ul class='collection' id='errorPoint'>"+
            "<li class='collection-item'>"+
                "<div>真实姓名</div>"+
                "<div>"+ this.info.name +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>任职机构</div>"+
                "<div>"+ this.info.company +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>头衔/职位</div>"+
                "<div>"+ this.info.title +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>工作年限</div>"+
                "<div>"+ this.info.work_year +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>手机号码</div>"+
                "<div>"+ this.expert_info.phone +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>常驻城市</div>"+
                "<div>"+ this.info.city +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>自我介绍</div>"+
                "<div>"+ this.info.self_intro +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>特长标签</div>"+
                "<div>"+ this.info.major +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>小纸条定价</div>"+
                "<div>"+ parseInt(this.info.note_price)/100 +"</div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>名片/工牌</div>"+
                "<div><img src='"+ util.changeUrl(this.info.card) +"'style='width:40%;cursor:pointer;margin-left:12%;' onclick=\"showSrcImg('"+ util.changeUrl(this.info.card) +"')\"></div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>个性照片</div>"+
                "<div><img src='"+ util.changeUrl(this.info.banner) +"'style='width:40%;cursor:pointer;margin-left:12%;' onclick=\"showSrcImg('"+ util.changeUrl(this.info.banner) +"')\"></div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>专家头像</div>"+
                "<div><img class='circle responsive-img' src='"+ util.changeUrl(this.info.avatar) +"'style='width:40%;cursor:pointer;margin-left:12%;' onclick=\"showSrcImg('"+ util.changeUrl(this.info.avatar) +"')\"></div>"+
            "</li>"+
            "<li class='collection-item'>"+
                "<div>不通过原因: <button class='btn' onclick='initAddErrorPoint()'>点击添加</button></div>"+
                "<ul data-bind='foreach: errorPointList' class='collection'>" +
                    "<li class='collection-item'><div><span data-bind='text: $data'></span><a href='#!' class='secondary-content' data-bind='click: deleteErrorPoint'>删除</a></div></li>" +
                "</ul>" +
            "</li>"+
            "<div class='mdl-grid' style='text-align: center'>"+
                "<div class='mdl-cell mdl-cell--12-col'><button type='button' title='通过' class='btn' data-bind='click: passRight'>通过</button>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<button type='button' title='不通过' class='btn' data-bind='click: passWrong'>不通过</button></div>" +
            "</div>"+
        "</ul>";
    dialog = $.dialog({
        backgroundDismiss: true,
        icon: "icon icon-document",
        title: "专家审核",
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    ko.applyBindings(vm,document.getElementById("errorPoint"));
}

//显示原图
function showSrcImg(src){
    $.dialog({
        icon: "icon icon-document-edit",
        title: '原图',
        content: "<div align='center'><button class='btn' onclick=\"util.rotateImg('testImg', 'left')\"><span class='entypo-ccw'></span>&nbsp;&nbsp;左转</button>&nbsp;&nbsp;"+
        "<button class='btn' onclick=\"util.rotateImg('testImg', 'right')\">右转&nbsp;&nbsp;<span class='entypo-cw'></span></button></div>" +
        "<br><img style='width:100%;max-width:100%;height:auto' src='"+src+"' id='testImg'>",
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
}

function initAddErrorPoint(){
    var html =  "<div class='input-field col s12'>"+
                "<textarea id='errorPointText' class='materialize-textarea'></textarea>"+
                "<label for='self_intro'>不通过原因</label>" +
                "</div>"+
                "<div><button type='button' title='通过' class='btn' onclick='addErrorPoint()'>提交</button></div>";
    addDialog = $.dialog({
        icon: "icon icon-document",
        title: '添加不通过原因',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    setTimeout(function(){
        $("#errorPointText").focus();
    },100);
}

function addErrorPoint(){
    vm.errorPointList.push($("#errorPointText").val());
    addDialog.close();
}

function deleteErrorPoint(){
    vm.errorPointList.splice(vm.errorPointList.indexOf(this.toString()),1);
}

function passRight(){
    util.callServerFunction({}
        ,'expert/check?random='+parseInt(Math.random()*10000)
        , {apply_id: vm.apply_id(), status: "verified"}
        , function(data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadExpertList();
            dialog.close();
        }else{
            util.errorCodeApi(data);
        }
    },"POST");
}

function passWrong(){
    if(vm.errorPointList().length<=0){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写不通过原因！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        util.callServerFunction({}
            ,'expert/check?random='+parseInt(Math.random()*10000)
            , {apply_id: vm.apply_id(), status: "fail", reason: vm.errorPointList().join(",")}
            , function(data) {
                if(data.code == 900){
                    Materialize.toast('操作成功!', 3000);
                    loadExpertList();
                    dialog.close();
                }else{
                    util.errorCodeApi(data);
                }
            },"POST");
    }
}

var viewModel = function() {
    this.expertList = ko.observableArray();
    this.errorPointList = ko.observableArray();
    this.apply_id = ko.observable("");
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.initExpertAudit = initExpertAudit;
    this.deleteErrorPoint = deleteErrorPoint;
    this.passRight = passRight;
    this.passWrong = passWrong;
};
var vm = new viewModel()
    ,dialog = null
    ,addDialog = null;
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("expertAuditDiv"));
    loadExpertList();
});