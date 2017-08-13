/**
 * Created by hjy on 2016/7/29 0029.
 */

function loadUserList(){
    var postObj = {
        phone: $("#u_phone").val(),
        nick: $("#u_nick").val(),
        getExpert: $("#u_type").val(),
        getBlack: $("#u_status").val(),
        start: (vm.startPosUser()-1)*vm.pageSizeUser()+1,
        limit: vm.pageSizeUser()
    };
    util.callServerFunction({},"users",postObj, function (data) {
        if(data.code == 900){
            vm.userList([]);
            if(data.list.length > 0){
                vm.userList(data.list);
            }else if (vm.startPosUser() != 1) {
                vm.startPosUser(vm.startPosUser() - 1);
                loadUserList();
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

function subLoadUserList(){
    vm.startPosUser(1);
    vm.pageSizeUser(15);
    loadUserList();
}

function prevPageUser(){
    if(vm.startPosUser()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosUser(vm.startPosUser()-1);
        loadUserList();
    }
}

function nextPageUser(){
    if(vm.userList().length == 15){
        vm.startPosUser(vm.startPosUser()+1);
        loadUserList();
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

function initAddUser(){
    vm.avatarSrc("");
    vm.avatarSrcOld("");
    vm.cardSrc("");
    vm.cardSrcOld("");
    vm.bannerSrc("");
    vm.bannerSrcOld("");
    vm.userID("");
    vm.tags([]);
    var html = "<div class='input-field col s12'>" +
        "<input type='file' id='avatar' style='display: none'>"+
        "<img id='avatarImg' class='circle responsive-img' style='width: 100px;height: 100px;margin-right: 10px;margin-bottom: 10px' src='' alt='请上传头像'>"+
        "<button type='button' class='btn' onclick=\"selectImg('avatar')\">选择文件&nbsp;&nbsp;图片建议尺寸：1600 * 900像素(16:9)</button>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='userNick' class='validate'>"+
        "<label for='userNick' class='active'>昵称</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='userPhone' class='validate'>"+
        "<label for='userPhone' class='active'>手机号</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='pwd' class='validate'>"+
        "<label for='pwd' class='active'>登陆密码</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='userType' onchange='changeUserInfo()'>"+
        "<option value=''>普通用户</option>"+
        "<option value='verified'>专家用户</option>"+
        "</select>"+
        "<label>用户类型</label>" +
        "</div>"+
        "<div id='expertInfo'>" +
        "<div class='input-field col s12'>"+
        "<input type='text' id='name' class='validate'>"+
        "<label for='name' class='active'>真实姓名</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='city' class='validate'>"+
        "<label for='city' class='active'>常驻城市</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='company' class='validate'>"+
        "<label for='company' class='active'>公司</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='title' class='validate'>"+
        "<label for='title' class='active'>头衔/职务</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='work_year'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='1-3年'>1-3年</option>"+
        "<option value='3-6年'>3-6年</option>"+
        "<option value='6-10年'>6-10年</option>"+
        "<option value='10年以上'>10年以上</option>"+
        "</select>"+
        "<label>工作年限</label>" +
        "</div>"+
        "<div class='col s12'>"+
        "<label>专家类别</label>";
    for(var i=0;i<vm.expertType().length;i++){
        for(var i=0;i<vm.expertType().length;i++){
            html += "<div style='margin: 10px 0px 10px 0px;'><input type='checkbox' name='category' value='"+ vm.expertType()[i].name +"' onchange='linkageCheckbox(this)' id='"+ i +"'><label for='"+ i +"'>"+ vm.expertType()[i].name +"</label></div>" +
                "<div style='padding-left: 20px'>";
            for(var j=0;j<vm.expertType()[i].list.length;j++){
                html += "<input type='checkbox' name='subCategory' value='"+ vm.expertType()[i].list[j] +"' onchange='linkageCheckbox(this)' id='"+ i+"-"+j +"'><label for='"+ i+"-"+j +"' style='margin-right: 10px'>"+ vm.expertType()[i].list[j] +"</label>";
            }
            html += "</div><br><div style='border-bottom: 1px #CCCCCC solid'></div>";
        }
    }
    html += "<br><div class='col s12'>"+
        "<label>特长标签</label><div id='major' class='chips col s12'></div>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='note_price' class='validate'>"+
        "<label for='note_price' class='active'>小纸条定价</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<textarea id='self_intro' class='materialize-textarea'></textarea>"+
        "<label for='self_intro'>自我介绍</label>" +
        "</div>"+
        "<div class='input-field col s12'>" +
        "<input type='file' id='card' style='display: none'>"+
        "<button type='button' class='btn' onclick=\"selectImg('card')\">选择名片/工牌</button>&nbsp;&nbsp;"+
        "<img id='cardImg' style='width: 50%;height: auto;margin-top: 5px' src='' alt='请上传名片/工牌照片'>"+
        "</div>"+
        "<div class='input-field col s12'>" +
        "<input type='file' id='banner' style='display: none'>"+
        "<button type='button' class='btn' onclick=\"selectImg('banner')\">选择个性照片</button>&nbsp;&nbsp;"+
        "<img id='bannerImg' style='width: 50%;height: auto;margin-top: 5px' src='' alt='请上传个性照片'>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "<div class='col s12 center-align'><button class='btn' style='margin-top: 10px' onclick='subUserInfo()'>提 交</button></div>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '新增用户',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
    $('.chips').material_chip({data:[]});
    $('.chips').on('chip.add', function(e, chip){
        vm.tags.push(chip.tag);
    });
    $('.chips').on('chip.delete', function(e, chip){
        vm.tags.splice(vm.tags.indexOf(chip.tag),1);
    });
    $("#expertInfo").hide();
    $("#avatar").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.avatarSrc(url);
            $("#avatarImg").attr('src',url);
        };
    });
    $("#card").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.cardSrc(url);
            $("#cardImg").attr('src',url);
        };
    });
    $("#banner").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.bannerSrc(url);
            $("#bannerImg").attr('src',url);
        };
    });
}

function initExpertType(){
    util.callServerFunction({},"topic/category",{}, function (data) {
        if(data.code == 900){
            vm.expertType(data.list);
        }else{
            util.errorCodeApi(data);
        }
    },"GET")
}

function subUserInfo(){
    categoryList = [];
    $(":checkbox[name='category']").each(function(){
        var checked = false, subCategory = [];
        $(this).parent().next().find(":checkbox[name='subCategory']").each(function(){
           if($(this).prop("checked")){
               checked = true;
               subCategory.push($(this).val());
           }
        });
        if(checked){
            categoryList.push({categoryName: $(this).val(),subCategory: subCategory});
        }
    });
    if($("#avatarImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请上传头像！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userNick").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写昵称！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userPhone").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写手机号码！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#pwd").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写登陆密码！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#name").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写真实姓名！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#city").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写常驻城市！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#company").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写公司！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#title").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写头衔/职务！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#work_year").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择工作年限！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && categoryList.length <= 0){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择专家类别！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && (vm.tags().length>3 || vm.tags().length<=0)){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写特长标签！至少填写3个标签，每个标签长度为2-6",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#note_price").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写小纸条定价单位：元，整数",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#self_intro").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写自我介绍！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#cardImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请上传名片/工牌照片！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#userType").val() == "verified" && $("#bannerImg").attr("src") == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请上传个性照片！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else {
        if ($("#avatarImg").attr("src") != vm.avatarSrcOld()) {
            util.upLoadImg($("#avatarImg").attr("src"),callbackCardImg);
        } else {
            callbackCardImg();
        }
    }
}

function callbackCardImg(){
    if ($("#avatarImg").attr("src") != vm.avatarSrcOld()) {
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            vm.avatarSrc(JSON.parse(xhr.response).filePath);
            if ($("#cardImg").attr("src") != vm.cardSrcOld()) {
                util.upLoadImg($("#cardImg").attr("src"),callbackBannerImg);
            } else {
                callbackBannerImg();
            }
        }
    }else{
        vm.avatarSrc(vm.avatarSrcOld());
        if ($("#cardImg").attr("src") != vm.cardSrcOld()) {
            util.upLoadImg($("#cardImg").attr("src"),callbackBannerImg);
        } else {
            callbackBannerImg();
        }
    }
}

function callbackBannerImg(){
    if ($("#cardImg").attr("src") != vm.cardSrcOld()) {
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            vm.cardSrc(JSON.parse(xhr.response).filePath);
            if ($("#bannerImg").attr("src") != vm.bannerSrcOld()) {
                util.upLoadImg($("#bannerImg").attr("src"),callback);
            } else {
                callback();
            }
        }
    }else{
        vm.cardSrc(vm.cardSrcOld());
        if ($("#bannerImg").attr("src") != vm.bannerSrcOld()) {
            util.upLoadImg($("#bannerImg").attr("src"),callback);
        } else {
            callback();
        }
    }
}

function callback(){
    var apiName = "user";
    if(vm.userID() != ""){
        apiName = "user/"+vm.userID();
    }
    if ($("#bannerImg").attr("src") != vm.bannerSrcOld()) {
        if (xhr.readyState == 4 && xhr.status === 200) {//readyState表示文档加载进度,4表示完毕
            vm.bannerSrc(JSON.parse(xhr.response).filePath);
            var postObj = {
                avatar: vm.avatarSrc(),
                nick: $("#userNick").val(),
                phone: $("#userPhone").val(),
                expert_status: $("#userType").val()
            };
            if(vm.userID() == ""){
                postObj.passwd = util.sha256($("#pwd").val());
            }
            if($("#userType").val() == "verified"){
                postObj.name = $("#name").val();
                postObj.city = $("#city").val();
                postObj.title = $("#title").val();
                postObj.company = $("#company").val();
                postObj.work_year = $("#work_year").val();
                postObj.major = vm.tags().join(",");
                postObj.self_intro = $("#self_intro").val();
                postObj.card = vm.cardSrc();
                postObj.banner = vm.bannerSrc();
                postObj.category = JSON.stringify(categoryList);
                postObj.note_price = parseInt($("#note_price").val())*100;
            }
            util.callServerFunction({}, apiName, postObj, function (resp) {
                if (resp.code == 900) {
                    Materialize.toast('操作成功', 3000);
                    dialog.close();
                    loadUserList();
                } else {
                    util.errorCodeApi(resp);
                }
            },"POST");
        }
    }else{
        vm.bannerSrc(vm.bannerSrcOld());
        var postObj = {
            avatar: vm.avatarSrc(),
            nick: $("#userNick").val(),
            phone: $("#userPhone").val(),
            expert_status: $("#userType").val()
        };
        if(vm.userID() == ""){
            postObj.passwd = util.sha256($("#pwd").val());
        }
        if($("#userType").val() == "verified"){
            postObj.name = $("#name").val();
            postObj.city = $("#city").val();
            postObj.title = $("#title").val();
            postObj.company = $("#company").val();
            postObj.work_year = $("#work_year").val();
            postObj.major = vm.tags().join(",");
            postObj.self_intro = $("#self_intro").val();
            postObj.card = vm.cardSrc();
            postObj.banner = vm.bannerSrc();
            postObj.category = JSON.stringify(categoryList);
            postObj.note_price = parseInt($("#note_price").val())*100;
        }
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('操作成功', 3000);
                dialog.close();
                subLoadUserList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function selectImg(sign){
    $("#"+sign).click();
}

function changeUserInfo(){
    if($("#userType").val() == "verified"){
        $("#expertInfo").show();
    }else{
        $("#expertInfo").hide();
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

function linkageCheckbox(obj){
    var name = $(obj).attr("name");
    if(name == "category"){
        if($(obj).prop("checked")){
            $(obj).parent().next().find(":checkbox[name='subCategory']").each(function(){
                $(this).prop("checked",true);
            });
        }else{
            $(obj).parent().next().find(":checkbox[name='subCategory']").each(function(){
                $(this).prop("checked",false);
            });
        }
    }else{
        var allEmpty = true;
        $(obj).parent().find(":checkbox[name='subCategory']").each(function(){
            if($(this).prop("checked")){
                allEmpty = false;
            }
        });
        if(allEmpty){
            $(obj).parent().prev().find(":checkbox[name='category']").prop("checked", false);
        }else{
            $(obj).parent().prev().find(":checkbox[name='category']").prop("checked", true);
        }
    }
}

function initEditUser(){
    var userInfo = this;
    vm.avatarSrcOld(userInfo.expert.avatar==undefined?userInfo.user.avatar:userInfo.expert.avatar);
    vm.userID(userInfo.userID);
    var html = "<div class='input-field col s12'>" +
        "<input type='file' id='avatar' style='display: none'>"+
        "<img id='avatarImg' class='circle responsive-img' style='width: 100px;height: 100px;margin-right: 10px;margin-bottom: 10px' src='' alt='请上传头像'>"+
        "<button type='button' class='btn' onclick=\"selectImg('avatar')\">选择文件&nbsp;&nbsp;图片建议尺寸：1600 * 900像素(16:9)</button>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='userNick' class='validate'>"+
        "<label for='userNick' class='active'>昵称</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='userPhone' class='validate'>"+
        "<label for='userPhone' class='active'>手机号</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='userType' onchange='changeUserInfo()'>"+
        "<option value=''>普通用户</option>"+
        "<option value='verified'>专家用户</option>"+
        "</select>"+
        "<label>用户类型</label>" +
        "</div>"+
        "<div id='expertInfo'>" +
        "<div class='input-field col s12'>"+
        "<input type='text' id='name' class='validate'>"+
        "<label for='name' class='active'>真实姓名</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='city' class='validate'>"+
        "<label for='city' class='active'>常驻城市</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='company' class='validate'>"+
        "<label for='company' class='active'>公司</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='title' class='validate'>"+
        "<label for='title' class='active'>头衔/职务</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<select id='work_year'>"+
        "<option value=''>--请选择--</option>"+
        "<option value='1-3年'>1-3年</option>"+
        "<option value='3-6年'>3-6年</option>"+
        "<option value='6-10年'>6-10年</option>"+
        "<option value='10年以上'>10年以上</option>"+
        "</select>"+
        "<label>工作年限</label>" +
        "</div>"+
        "<div class='col s12'>"+
        "<label>专家类别</label>";
    for(var i=0;i<vm.expertType().length;i++){
        for(var i=0;i<vm.expertType().length;i++){
            html += "<div style='margin: 10px 0px 10px 0px;'><input type='checkbox' name='category' value='"+ vm.expertType()[i].name +"' onchange='linkageCheckbox(this)' id='"+ i +"'><label for='"+ i +"'>"+ vm.expertType()[i].name +"</label></div>" +
                "<div style='padding-left: 20px'>";
            for(var j=0;j<vm.expertType()[i].list.length;j++){
                html += "<input type='checkbox' name='subCategory' value='"+ vm.expertType()[i].list[j] +"' onchange='linkageCheckbox(this)' id='"+ i+"-"+j +"'><label for='"+ i+"-"+j +"' style='margin-right: 10px'>"+ vm.expertType()[i].list[j] +"</label>";
            }
            html += "</div><br><div style='border-bottom: 1px #CCCCCC solid'></div>";
        }
    }
    html += "<br><div class='col s12'>"+
        "<label>特长标签</label><div id='majorEdit' class='chips col s12'></div>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<input type='text' id='note_price' class='validate'>"+
        "<label for='note_price' class='active'>小纸条定价</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<textarea id='self_intro' class='materialize-textarea'></textarea>"+
        "<label for='self_intro' class='active'>自我介绍</label>" +
        "</div>"+
        "<div class='input-field col s12'>" +
        "<input type='file' id='card' style='display: none'>"+
        "<button type='button' class='btn' onclick=\"selectImg('card')\">选择名片/工牌</button>&nbsp;&nbsp;"+
        "<img id='cardImg' style='width: 50%;height: auto;margin-top: 5px' src='' alt='请上传名片/工牌照片'>"+
        "</div>"+
        "<div class='input-field col s12'>" +
        "<input type='file' id='banner' style='display: none'>"+
        "<button type='button' class='btn' onclick=\"selectImg('banner')\">选择个性照片</button>&nbsp;&nbsp;"+
        "<img id='bannerImg' style='width: 50%;height: auto;margin-top: 5px' src='' alt='请上传个性照片'>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "<div class='col s12 center-align'><button class='btn' style='margin-top: 10px' onclick='subUserInfo()'>提 交</button></div>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑用户',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    var tags = []
    $("#expertInfo").hide();
    $("#userNick").val(userInfo.nick);
    $("#userPhone").val(userInfo.phone);
    $("#userType").val(userInfo.expert_status);
    $("#avatarImg").attr("src",userInfo.expert.avatar==undefined?userInfo.user.avatar:userInfo.expert.avatar);
    if(userInfo.expert_status == "verified"){
        $("#name").val(userInfo.expert.name);
        $("#city").val(userInfo.expert.city);
        $("#title").val(userInfo.expert.title);
        $("#company").val(userInfo.expert.company);
        $("#work_year").val(userInfo.expert.work_year);
        $("#self_intro").val(userInfo.expert.self_intro);
        $('#self_intro').trigger('autoresize');
        $("#cardImg").attr("src",userInfo.expert.card);
        $("#bannerImg").attr("src",userInfo.expert.banner);
        $("#note_price").val(parseInt(userInfo.expert.note_price)/100);
        vm.tags(userInfo.expert.major);
        for(var i=0;i<vm.tags().length;i++){
            tags.push({
                tag: vm.tags()[i]
            });
        }
        $("#expertInfo").show();
        for(var i=0;i<userInfo.expert.category.length;i++){
            $(":checkbox[value='"+ userInfo.expert.category[i].categoryName +"']").prop("checked","true");
            for(var j=0;j<userInfo.expert.category[i].subCategory.length;j++){
                $(":checkbox[value='"+ userInfo.expert.category[i].subCategory[j] +"']").prop("checked","true");
            }
        }
        vm.cardSrcOld(userInfo.expert.card);
        vm.bannerSrcOld(userInfo.expert.banner);
    }
    $('#majorEdit').material_chip({data: tags});
    $('#majorEdit').on('chip.add', function(e, chip){
        vm.tags.push(chip.tag);
    });
    $('#majorEdit').on('chip.delete', function(e, chip){
        vm.tags.splice(vm.tags.indexOf(chip.tag),1);
    });
    $('select').material_select();
    $("#avatar").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.avatarSrc(url);
            $("#avatarImg").attr('src',url);
        };
    });
    $("#card").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.cardSrc(url);
            $("#cardImg").attr('src',url);
        };
    });
    $("#banner").change(function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 DataURL
            var url = reader.result;
            vm.bannerSrc(url);
            $("#bannerImg").attr('src',url);
        };
    });
}

function loadUserTopics(){
    var postObj = {
        start: (vm.startPosTopic()-1)*vm.pageSizeTopic()+1,
        limit: vm.pageSizeTopic()
    };
    util.callServerFunction({},"user/"+ vm.userID()+"/topics",postObj, function (data) {
        if(data.code == 900){
            vm.topicList([]);
            if(data.list.length > 0){
                vm.topicList(data.list);
            }else if (vm.startPosUser() != 1) {
                vm.startPosTopic(vm.startPosTopic() - 1);
                loadUserTopics();
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

function showUserTopics(){
    vm.userID(this.userID);
    vm.startPosTopic(1);
    vm.pageSizeTopic(15);
    vm.topicList([]);
    var html = "<div id='topicDiv'>" +
        "<div class='row'>" +
        "<div class='input-field col l3'>" +
        "<a class='waves-effect waves-light btn' href='javascript:initAddTopic()'>添加私课</a>" +
        "</div>" +
        "</div>" +
        "<table class='bordered highlight responsive-table'>" +
        "<thead>" +
        "<tr>" +
        "<th align='center'>序号</th>" +
        "<th align='center' style='width: 15% !important;'>标题</th>" +
        "<th align='center'>一级分类</th>" +
        "<th align='center'>二级分类</th>" +
        "<th align='center'>价格</th>" +
        "<th align='center' style='width: 40% !important;'>内容</th>" +
        "<th align='center'>操作</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody data-bind='foreach: topicList'>" +
        "<tr>" +
        "<td align='center'><span data-bind='text: $index()+1'></span></td>" +
        "<td align='center'><span data-bind='text: title'></span></td>" +
        "<td align='center'><span data-bind='text: category'></span></td>" +
        "<td align='center'><span data-bind='text: subCategory'></span></td>" +
        "<td align='center'><span data-bind='text: price/100'></span></td>" +
        "<td align='center'><span data-bind='text: description' style='word-break: break-all;word-wrap: break-word;'></span></td>" +
        "<td align='center'><a href='' class='btn' data-bind='click: initEditTopic'>编辑</a></td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "<div align='center'>" +
        "<ul class='pagination'>" +
        "<li class='waves-effect'><a href='javascript:prevPageTopic()'><i class='material-icons'>chevron_left</i></a></li>" +
        "<li class='active'><a href='javascript:void(0)' data-bind='text: startPosTopic'>1</a></li>" +
        "<li class='waves-effect'><a href='javascript:nextPageTopic()'><i class='material-icons'>chevron_right</i></a></li>" +
        "</ul>" +
        "</div>" +
        "</div>";
    var dialogPoint = $.dialog({
        icon: "icon icon-plus",
        title: this.expert.name + "-私课列表",
        content: html,
        theme: "material",
        columnClass: "col l10 offset-l1 s12"
    });
    ko.applyBindings(vm,document.getElementById("topicDiv"));
    loadUserTopics();
}

function prevPageTopic(){
    if(vm.startPosTopic()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosTopic(vm.startPosTopic()-1);
        loadUserTopics();
    }
}

function nextPageTopic(){
    if(vm.topicList().length == 15){
        vm.startPosTopic(vm.startPosTopic()+1);
        loadUserTopics();
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

function initAddTopic(){
    vm.topicId("");
    //vm.topicTags([]);
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>私课类型</label>" +
        "<select id='type'>"+
        "<option value='phone'>通话</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>私课状态</label>" +
        "<select id='status'>"+
        "<option value='verified'>打开</option>"+
        "<option value='closed'>关闭</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>私课主题</label><input type='text' id='title' value=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>私课分类</label>" +
        "<select id='category' onchange='changeSubCategory()'>"+
        "<option value=''>--请选择--</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>子分类</label>" +
        "<select id='subCategory'>"+
        "<option value=''>--请选择--</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<textarea id='summary' class='materialize-textarea'></textarea>"+
        "<label>私课摘要</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<textarea id='description' class='materialize-textarea'></textarea>"+
        "<label>详细介绍</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>私课价格（单位：元）</label><input type='text' id='price' value=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label>持续时长（单位：分钟）</label><input type='text' id='duration' value=''>"+
        "</div>"+
        //"<div class='col s12'>"+
        //"<label>私课标签</label><div id='tags' class='chips col s12'></div>"+
        //"</div>"+
        "<button class='btn btn-default' onclick='addTopic()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '添加私课',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    //$('#tags').material_chip({data:[]});
    //$('#tags').on('chip.add', function(e, chip){
    //    vm.topicTags.push(chip.tag);
    //});
    //$('.chips').on('chip.delete', function(e, chip){
    //    vm.topicTags.splice(vm.topicTags.indexOf(chip.tag),1);
    //});
    for(var i=0;i<vm.expertType().length;i++){
        $("#category").append("<option value='"+ vm.expertType()[i].name +"'>"+ vm.expertType()[i].name +"</option>");
    }
    $('select').material_select();
}

function changeSubCategory(){
    var category = $("#category").val();
    $("#subCategory").html("<option value=''>--请选择--</option>");
    if(category != ""){
        for(var i=0;i<vm.expertType().length;i++){
            if(vm.expertType()[i].name == category){
                for(var j=0;j<vm.expertType()[i].list.length;j++){
                    $("#subCategory").append("<option value='"+ vm.expertType()[i].list[j] +"'>"+ vm.expertType()[i].list[j] +"</option>");
                }
            }
        }
    }
    $('select').material_select();
}

function initEditTopic(){
    vm.topicId(this.topic_id);
    var html = "<div class='input-field col s12'>"+
        "<label class='active'>私课类型</label>" +
        "<select id='type'>"+
        "<option value='phone'>通话</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>私课状态</label>" +
        "<select id='status'>"+
        "<option value='verified'>打开</option>"+
        "<option value='closed'>关闭</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>私课主题</label><input type='text' id='title' value=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>私课分类</label>" +
        "<select id='category' onchange='changeSubCategory()'>"+
        "<option value=''>--请选择--</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>子分类</label>" +
        "<select id='subCategory'>"+
        "<option value=''>--请选择--</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<textarea id='summary' class='materialize-textarea'></textarea>"+
        "<label class='active'>私课摘要</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<textarea id='description' class='materialize-textarea'></textarea>"+
        "<label class='active'>详细介绍</label>" +
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>私课价格（单位：元）</label><input type='text' id='price' value=''>"+
        "</div>"+
        "<div class='input-field col s12'>"+
        "<label class='active'>持续时长（单位：分钟）</label><input type='text' id='duration' value=''>"+
        "</div>"+
        "<button class='btn btn-default' onclick='addTopic()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '编辑私课',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $("#status").val(this.status);
    $("#title").val(this.title);
    $("#summary").val(this.summary);
    $("#description").val(this.description);
    $("#price").val(this.price/100);
    $("#duration").val(this.duration);
    for(var i=0;i<vm.expertType().length;i++){
        $("#category").append("<option value='"+ vm.expertType()[i].name +"'>"+ vm.expertType()[i].name +"</option>");
        for(var j=0;j<vm.expertType()[i].list.length;j++){
            $("#subCategory").append("<option value='"+ vm.expertType()[i].list[j] +"'>"+ vm.expertType()[i].list[j] +"</option>");
        }
    }
    $("#category").val(this.category);
    $("#subCategory").val(this.subCategory);
    $('select').material_select();
}

function addTopic(){
    if($("#type").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写私课类型！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#title").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写私课主题！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#category").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择私课分类！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#subCategory").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择私课子分类！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#summary").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写私课摘要！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#description").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写私课详细介绍！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#price").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写私课价格！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#duration").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写私课持续时长！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        var apiName = "user/"+ vm.userID() +"/topic";
        if(vm.topicId() != ""){
            apiName = "topic/"+vm.topicId();
        }
        var postObj = {
            type: $("#type").val(),
            title: $("#title").val(),
            category: $("#category").val(),
            subCategory: $("#subCategory").val(),
            summary: $("#summary").val(),
            description: $("#description").val(),
            price: $("#price").val()*100,
            duration: $("#duration").val(),
            status: $("#status").val()
        };
        util.callServerFunction({}, apiName, postObj, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('操作成功', 3000);
                dialog.close();
                loadUserTopics();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function showUserMoney(){
    vm.userID(this.userID);
    vm.startPosMoney(1);
    vm.pageSizeMoney(15);
    vm.moneyList([]);
    var html = "<div id='moneyDiv'>" +
        "<div class='row'>" +
        "<div class='input-field col l3 s12'>"+
        "<label>开始时间</label>" +
        "<input id='startTime' type='text'>"+
        "</div>"+
        "<div class='input-field col l3 s12'>"+
        "<label>结束时间</label>" +
        "<input id='endTime' type='text'>"+
        "</div>"+
        "<div class='input-field col l3 s12'>"+
        "<label class='active'>类型</label>" +
        "<select id='type'>"+
        "<option value=''>全部</option>"+
        "<option value='order'>订单</option>"+
        "<option value='note'>小纸条</option>"+
        "<option value='listen'>偷听</option>"+
        "<option value='withdraw'>提现</option>"+
        "</select>"+
        "</div>"+
        "<div class='input-field col l3'>" +
        "<a class='waves-effect waves-light btn' href='javascript: loadUserMoney()'>检 索</a>" +
        "</div>" +
        "</div>" +
        "<table class='bordered highlight responsive-table'>" +
        "<thead>" +
        "<tr>" +
        "<th align='center'>序号</th>" +
        "<th align='center'>类型</th>" +
        "<th align='center'>金额</th>" +
        "<th align='center'>创建时间</th>" +
        "<th align='center'>备注</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody data-bind='foreach: moneyList'>" +
        "<tr>" +
        "<td align='center'><span data-bind='text: $index()+1'></span></td>" +
        "<td align='center'><span data-bind=\"text: type=='order'?'订单':type=='note'?'小纸条':type=='listen'?'偷听':'提现'\"></span></td>" +
        "<td align='center'><span data-bind='text: amount/100'></span></td>" +
        "<td align='center'><span data-bind='text: util.convertTime2Str(createdAt)'></span></td>" +
        "<td align='center'><span data-bind='text: desc'></span></td>" +
        "</tr>" +
        "</tbody>" +
        "</table>" +
        "<div align='center'>" +
        "<ul class='pagination'>" +
        "<li class='waves-effect'><a href='javascript:prevPageMoney()'><i class='material-icons'>chevron_left</i></a></li>" +
        "<li class='active'><a href='javascript:void(0)' data-bind='text: startPosMoney'>1</a></li>" +
        "<li class='waves-effect'><a href='javascript:nextPageMoney()'><i class='material-icons'>chevron_right</i></a></li>" +
        "</ul>" +
        "</div>" +
        "</div>";
    var dialogPoint = $.dialog({
        icon: "icon icon-plus",
        title: this.expert.name + "-资金变动记录",
        content: html,
        theme: "material",
        columnClass: "col l8 offset-l2 s12"
    });
    $('#startTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('#endTime').datetimepicker({format: 'Y-m-d H:i:s'});
    $('select').material_select();
    ko.applyBindings(vm,document.getElementById("moneyDiv"));
    loadUserMoney();
}

function loadUserMoney(){
    var postObj = {
        start: (vm.startPosMoney()-1)*vm.pageSizeMoney()+1,
        limit: vm.pageSizeMoney(),
        type: $("#type").val()
    };
    if($("#startTime").val() != ""){
        postObj.startAt = new Date($("#startTime").val()).getTime();
    }
    if($("#endTime").val() != ""){
        postObj.endAt = new Date($("#endTime").val()).getTime();
    }
    util.callServerFunction({}, "user/"+vm.userID()+"/money", postObj, function (resp) {
        if (resp.code == 900) {
            vm.moneyList(resp.list);
        } else {
            util.errorCodeApi(resp);
        }
    },"GET");
}

function prevPageMoney(){
    if(vm.startPosMoney()==1){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"您已经在第一页了！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        vm.startPosMoney(vm.startPosMoney()-1);
        loadUserMoney();
    }
}

function nextPageMoney(){
    if(vm.moneyList().length == 15){
        vm.startPosMoney(vm.startPosMoney()+1);
        loadUserMoney();
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

function initAddBlack(){
    vm.userID(this.userID);
    var html = "<div class='input-field col s12'>";
    if(this.block_util != null){
        html += "<label class='active'>解除时间</label><input id='block_util' type='text' value='"+ util.convertTime2Str(this.block_util) +"'>";
    }else{
        html += "<label>解除时间</label><input id='block_util' type='text'>";
    }
    html += "</div><div class='input-field col s12'>";
    if(this.block_reason != ""){
        html += "<label class='active'>加黑原因</label><input type='text' class='validate' id='block_reason' value='"+ this.block_reason +"'>";
    }else{
        html += "<label>加黑原因</label><input type='text' class='validate' id='block_reason'>";
    }
    html += "</div><button class='btn' onclick='addBlack()'>提 交</button>";
    dialog = $.dialog({
        icon: "icon icon-plus",
        title: '加入黑名单',
        content: html,
        theme: "material",
        columnClass: "col l6 offset-l3 s12"
    });
    $('select').material_select();
    $('#block_util').datetimepicker({format: 'Y-m-d H:i:s'});
}

function addBlack(){
    if($("#block_util").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请选择解除时间！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else if($("#block_reason").val() == ""){
        $.dialog({
            icon: 'icon icon-warning',
            title: '提示信息',
            content:"请填写加黑原因！",
            theme: "material",
            columnClass: "col l6 offset-l3 s12"
        })
    }else{
        util.callServerFunction({}, "user/"+vm.userID()+"/black", {"block_util":$("#block_util").val(),"block_reason":$("#block_reason").val()}, function (resp) {
            if (resp.code == 900) {
                Materialize.toast('操作成功', 3000);
                dialog.close();
                loadUserList();
            } else {
                util.errorCodeApi(resp);
            }
        },"POST");
    }
}

function removeBlack(){
    util.callServerFunction({}, "user/"+this.userID+"/black", {"action":"remove"}, function (resp) {
        if (resp.code == 900) {
            Materialize.toast('操作成功', 3000);
            loadUserList();
        } else {
            util.errorCodeApi(resp);
        }
    },"POST");
}

var viewModel = function () {
    this.userList = ko.observableArray();
    this.startPosUser = ko.observable(1);
    this.pageSizeUser = ko.observable(15);
    this.prevPageUser = prevPageUser;
    this.nextPageUser = nextPageUser;
    this.initEditUser = initEditUser;
    this.showUserTopics = showUserTopics;
    this.avatarSrc = ko.observable("");
    this.avatarSrcOld = ko.observable("");
    this.cardSrc = ko.observable("");
    this.cardSrcOld = ko.observable("");
    this.bannerSrc = ko.observable("");
    this.bannerSrcOld = ko.observable("");
    this.userID = ko.observable("");
    this.expertType = ko.observableArray();
    this.tags = ko.observableArray();

    this.topicList = ko.observableArray();
    this.topicTags = ko.observableArray();
    this.startPosTopic = ko.observable(1);
    this.pageSizeTopic = ko.observable(15);
    this.topicId = ko.observable("");
    this.prevPageTopic = prevPageTopic;
    this.nextPageTopic = nextPageTopic;
    this.initEditTopic = initEditTopic;

    this.showUserMoney = showUserMoney;
    this.moneyList = ko.observableArray();
    this.startPosMoney = ko.observable(1);
    this.pageSizeMoney = ko.observable(15);
    this.prevPageMoney = prevPageMoney;
    this.nextPageMoney = nextPageMoney;

    this.initAddBlack = initAddBlack;
    this.removeBlack = removeBlack;
}
var vm = new viewModel()
    ,date = new Date()
    ,dialog = ""
    ,xhr = new XMLHttpRequest()
    categoryList = [];
$(document).ready(function() {
    ko.applyBindings(vm, document.getElementById("userManager"));
    //document.onkeydown = function (event) {
    //    e = event ? event : (window.event ? window.event : null);
    //    if (e.keyCode == 13) {
    //        subLoadUserList();
    //        return false;
    //    }
    //}
    initExpertType();
    loadUserList();
    $('select').material_select();
});