/**
 * Created by hjy on 2016/8/12 0012.
 */

function loadIndexClassificationList(){
    var postObj = {
        start: (vm.startPos()-1)*vm.pageSize()+1,
        limit: vm.pageSize(),
        valid: $("#valid").val(),
        type: "category"
    };
    util.callServerFunction({},'category', postObj, function(resp){
        if(resp.code == 900){
            vm.indexClassificationList([]);
            if (resp.list.length > 0) {
                vm.indexClassificationList(resp.list);
            }else if (vm.startPos() != 1) {
                vm.startPos(vm.startPos() - 1);
                loadIndexClassificationList();
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

function loadSubCategory(categoryName){
    var postObj = {
        start: 1,
        limit: 99999,
        valid: "true",
        type: "subCategory",
        categoryName: categoryName
    };
    util.callServerFunction({},'category', postObj, function(resp){
        if(resp.code == 900){
            vm.subCategoryList(resp.list);
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
        loadIndexClassificationList();
    }
}

function nextPage(){
    vm.startPos(vm.startPos()+1);
    loadIndexClassificationList();
}

function subLoadIndexClassificationList(){
    vm.startPos(1);
    vm.pageSize(15);
    loadIndexClassificationList();
}

function initAddClassification(){
    vm.orderSrc("");
    vm.orderSrcOld("");
    vm.bannerSrc("");
    vm.bannerSrcOld("");
    var html = "<div class='input-field col s12'>"+
        "<label>主分类名称</label><input type='text' class='validate' id='categoryName'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='file' id='order_banner' style='display: none'/>"+
        "<button type='button' class='btn' onclick=\"selectImg('order_banner')\">选择订单列表横幅图片</button>"+
        "<img id='order_bannerImg' style='width: 100%;height: auto;margin-top: 5px' src=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='file' id='classificationImg' style='display: none'/>"+
        "<button type='button' class='btn' onclick=\"selectImg('classificationImg')\">分类图片</button>"+
        "<img id='classImg' style='width: 100%;height: auto;margin-top: 5px' src=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>备注</label><input type='text' class='validate' id='desc'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='validMain'>"+
        "<option value='false'>无效</option>"+
        "<option value='true'>有效</option>"+
        "</select>"+
        "<label for='valid'>是否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick='uploadMainClass()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '新增主分类',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
    $("#order_banner").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            $("#order_bannerImg").attr('src',url);
        };
    });
    $("#classificationImg").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            $("#classImg").attr('src',url);
        };
    });
}

function uploadMainClass(){
    if($("#categoryName").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写主分类名称！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#order_bannerImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请上传订单列表横幅图片！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if($("#classImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请上传分类图片！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else if($("#seq").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写分类顺序！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    } else {
        if ($("#order_bannerImg").attr("src") != vm.orderSrcOld()) {
            util.upLoadImg($("#order_bannerImg").attr("src"),callbackOrderImg);
        } else {
            callbackOrderImg();
        }
    }
}

function callbackOrderImg(){
    if ($("#order_bannerImg").attr("src") != vm.orderSrcOld()) {
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            vm.orderSrc(JSON.parse(xhr.response).filePath);
            if ($("#classImg").attr("src") != vm.bannerSrcOld()) {
                util.upLoadImg($("#classImg").attr("src"),callbackBannerImg);
            } else {
                callbackBannerImg();
            }
        }
    }else{
        vm.orderSrc(vm.orderSrcOld());
        if ($("#classImg").attr("src") != vm.bannerSrcOld()) {
            util.upLoadImg($("#classImg").attr("src"),callbackBannerImg);
        } else {
            callbackBannerImg();
        }
    }
}

function callbackBannerImg(){
    var apiName = "category";
    if(vm.category_id() != ""){
        apiName = "category/"+vm.category_id();

    }
    if ($("#classImg").attr("src") != vm.bannerSrcOld()) {
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            vm.bannerSrc(JSON.parse(xhr.response).filePath);
            var postObj = {
                order_banner: vm.orderSrc(),
                img: vm.bannerSrc(),
                categoryName: $("#categoryName").val(),
                type: "category",
                desc: $("#desc").val(),
                valid: $("#validMain").val(),
                seq: $("#seq").val()
            };
            util.callServerFunction({}, apiName, postObj, function (resp) {
                if (resp.code == 900) {
                    Materialize.toast('操作成功', 3000);
                    dialog.close();
                    loadIndexClassificationList();
                } else {
                    util.errorCodeApi(resp);
                }
            },"POST");
        }
    }else {
        vm.bannerSrc(vm.bannerSrcOld());
        var postObj = {
            order_banner: vm.orderSrc(),
            img: vm.bannerSrc(),
            categoryName: $("#categoryName").val(),
            type: "category",
            desc: $("#desc").val(),
            valid: $("#validMain").val(),
            seq: $("#seq").val()
        };
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('操作成功', 3000);
                dialog.close();
                loadIndexClassificationList();
            } else {
                util.errorCodeApi(resp);
            }
        }, "POST");
    }
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function selectImg(id){
    $("#"+id).click();
}

function initEditClassification(){
    loadSubCategory(this.categoryName)
    vm.category_id(this.category_id);
    vm.orderSrcOld(this.order_banner);
    vm.bannerSrcOld(this.img);
    var html = "<div id='editClassification'><div class='input-field col s12'>"+
        "<label class='active'>主分类名称</label><input type='text' class='validate' id='categoryName' value='"+ this.categoryName +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='file' id='order_banner' style='display: none'/>"+
        "<button type='button' class='btn' onclick=\"selectImg('order_banner')\">选择订单列表横幅图片</button>"+
        "<img id='order_bannerImg' style='width: 100%;height: auto;margin-top: 5px' src='"+ this.order_banner +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='file' id='classificationImg' style='display: none'/>"+
        "<button type='button' class='btn' onclick=\"selectImg('classificationImg')\">分类图片</button>"+
        "<img id='classImg' style='width: 100%;height: auto;margin-top: 5px' src='"+ this.img +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>备注</label><input type='text' class='validate' id='desc' value='"+ this.desc +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='validMain'>"+
        "<option value='false' selected>无效</option>"+
        "<option value='true'>有效</option>"+
        "</select>"+
        "<label for='valid'>是否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='seq' placeholder='例：填写1（第一位显示）' value='"+ this.seq +"'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<div class='input-field col s12'>" +
        "<div style='margin-bottom: 10px;'><button type='button' class='btn' onclick=\"initAddSubCategory('"+ this.categoryName +"')\">添加子分类</button></div>"+
        "<div data-bind='foreach: subCategoryList'>" +
        "<button type='button' class='btn' style='margin-bottom: 5px' data-bind='click: initEditSubcategory, text: subCategoryName'></button>&nbsp;&nbsp;" +
        "</div>"+
        "</div>"+
        "<div class='col s12 center-align'><button class='btn' onclick='uploadMainClass()'>提 交</button></div></div>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑主分类',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#validMain").val(this.valid+"");
    $('select').material_select();
    $("#order_banner").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            $("#order_bannerImg").attr('src',url);
        };
    });
    $("#classificationImg").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            $("#classImg").attr('src',url);
        };
    });
    ko.applyBindings(vm,document.getElementById("editClassification"));
}

function initAddSubCategory(categoryName){
    var html = "<div class='input-field col s12'>"+
        "<label>子分类名称</label><input type='text' class='validate' id='subCategoryName'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>备注</label><input type='text' class='validate' id='subDesc'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='subValid'>"+
        "<option value='true' selected>有效</option>"+
        "<option value='false'>无效</option>"+
        "</select>"+
        "<label for='subValid'>是否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='subSeq' placeholder='例：填写1（第一位显示）'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick=\"addSubCategory('"+ categoryName +"')\">提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '新增子分类',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
}

function addSubCategory(categoryName){
    var subCategory = {
        categoryName: categoryName,
        type: "subCategory",
        subCategoryName: $("#subCategoryName").val(),
        desc: $("#subDesc").val(),
        valid: $("#subValid").val(),
        seq: $("#subSeq").val()
    };
    util.callServerFunction({}, "category", subCategory, function (resp) {
        if (resp.code == 900) {
            subCategory.category_id = resp.category_id;
            vm.subCategoryList.push(subCategory);
            dialog.close();
        } else {
            util.errorCodeApi(resp);
        }
    }, "POST");
}

function initEditSubcategory(){
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>子分类名称</label><input type='text' class='validate' id='subCategoryName' value='"+ this.subCategoryName +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>备注</label><input type='text' class='validate' id='subDesc' value='"+ this.desc +"'>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='subValid'>"+
        "<option value='false'>无效</option>"+
        "<option value='true'>有效</option>"+
        "</select>"+
        "<label for='subValid'>是否有效</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' class='validate' id='subSeq' placeholder='例：填写1（第一位显示）' value='"+ this.seq +"'>"+
        "<label class='active'>显示顺序</label>"+
        "</div>"+
        "<button class='btn' onclick=\"editSubCategory('"+ vm.subCategoryList.indexOf(this) +"','"+ this.categoryName +"','"+ this.category_id +"')\">提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑子分类',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#subValid").val(this.valid+"");
    $('select').material_select();
}

function editSubCategory(index,categoryName,category_id){
    var subCategory = {
        categoryName: categoryName,
        type: "subCategory",
        subCategoryName: $("#subCategoryName").val(),
        desc: $("#subDesc").val(),
        valid: $("#subValid").val(),
        seq: $("#subSeq").val()
    };
    util.callServerFunction({}, "category/"+category_id, subCategory, function (resp) {
        if (resp.code == 900) {
            vm.subCategoryList.splice(index,1,subCategory);
            dialog.close();
        } else {
            util.errorCodeApi(resp);
        }
    }, "POST");
    dialog.close();
}

function setValid(){
    var category_id = this.category_id
    var postObj = {
        valid: !this.valid
    };
    util.callServerFunction({},'category/'+ category_id, postObj, function (data) {
        if(data.code == 900){
            Materialize.toast('操作成功!', 3000);
            loadIndexClassificationList();
        }else{
            util.errorCodeApi(data);
        }
    },"POST")
}

function showSrcImg(obj){
    $.dialog({
        icon: "icon icon-document-edit",
        title: '原图',
        content: "<div align='center'><button class='btn btn-success' onclick=\"util.rotateImg('testImg', 'left')\"><span class='entypo-ccw'></span>&nbsp;&nbsp;左转</button>&nbsp;&nbsp;"+
        "<button class='btn btn-success' onclick=\"util.rotateImg('testImg', 'right')\">右转&nbsp;&nbsp;<span class='entypo-cw'></span></button></div>" +
        "<br><img style='width:100%;max-width:100%;height:auto' src='"+ $(obj).find("img").attr("src") +"' id='testImg'>",
        theme: "material",
        columnClass: "col-lg-6 col-lg-offset-3 col-xs-12 s12"
    });
}

var viewModel = function() {
    this.indexClassificationList = ko.observableArray();
    this.subCategoryList = ko.observableArray();
    this.startPos = ko.observable(1);
    this.pageSize = ko.observable(15);
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.setValid = setValid;
    this.initEditClassification = initEditClassification;
    this.initAddSubCategory = initAddSubCategory;
    this.initEditSubcategory = initEditSubcategory;
    this.orderSrc = ko.observable("");
    this.orderSrcOld = ko.observable("");
    this.bannerSrc = ko.observable("");
    this.bannerSrcOld = ko.observable("");
    this.category_id = ko.observable("");
}
var vm = new viewModel()
    ,xhr = new XMLHttpRequest();
$(document).ready(function(){
    ko.applyBindings(vm,document.getElementById("indexClassificationMain"));
    subLoadIndexClassificationList();
    document.onkeydown = function(event){
        e = event ? event :(window.event ? window.event : null);
        if(e.keyCode==13){
            subLoadIndexClassificationList();
            return false;
        }
    }
    $('select').material_select();
    $.datetimepicker.setLocale("ch");
});