/**
 * Created by hjy on 2015/9/19 0019.
 */
    function tabExpertAudit(){
        var title = "专家审核管理";
        var menus = ["专家管理","专家审核管理"];
        var hrefs = ["javascript:tabExpertAudit()","javascript:tabExpertAudit()"];
        var url = "expertManager/expertAudit.html";
        initMenu(menus,hrefs,title,url);
    }

    function tabIndexBanner(){
        var title = "首页Banner管理";
        var menus = ["运营管理","首页Banner管理"];
        var hrefs = ["javascript:tabIndexBanner()","javascript:tabIndexBanner()"];
        var url = "operationsManager/indexBanner.html";
        initMenu(menus,hrefs,title,url);
    }

    function tabUser(){
        var title = "用户管理";
        var menus = ["运营管理","用户管理"];
        var hrefs = ["javascript:tabIndexBanner()","javascript:tabUser()"];
        var url = "operationsManager/user.html";
        initMenu(menus,hrefs,title,url);
    }

    function tabUserFeedback(){
        var title = "用户反馈管理";
        var menus = ["运营管理","用户反馈管理"];
        var hrefs = ["javascript:tabIndexBanner()","javascript:tabUserFeedback()"];
        var url = "operationsManager/userFeedback.html";
        initMenu(menus,hrefs,title,url);
    }

    function tabOnlineConfig(){
        var title = "系统管理";
        var menus = ["系统管理","在线参数管理"];
        var hrefs = ["javascript:tabOnlineConfig()","javascript:tabOnlineConfig()"];
        var url = "systemManager/onlineConfig.html";
        initMenu(menus,hrefs,title,url);
    }

    function initMenu(menus,hrefs,title,url){
        $('#element').fadeOut(0);
        var breadcrumb = "<li><span class='entypo-home'></span></li>";
        for(var i=0;i<menus.length;i++){
            breadcrumb += "<li><i class='fa fa-lg fa-angle-right'></i></li><li><a href='"+hrefs[i]+"' title='"+menus[i]+"'>"+menus[i]+"</a></li>";
        }

        document.onkeydown = function(e){
            e = e||window.event;
            if(e.keyCode==116){
                initMenu(menus,hrefs,title,url);
                return false;
            }
        }

        $("#h2Title").text(title);
        $("#breadcrumb").empty();
        $("#breadcrumb").append(breadcrumb);
        $('#element').empty();
        $('#element').load(url);
        $('#element').fadeIn(250);
        $("html body").scrollTop(0);
    }

    function initPage(){
        if(true){
            $("#expertManager,#expertAudit," +
              "#operationsManager,#indexBanner,#user,#userFeedback," +
              "#systemManager,#onlineConfig").removeClass("hidden"); //专家管理
            tabExpertAudit();
        }else if(util.getSessionStorage("userType")=="admin"){
            var sections = util.getSessionStorage('sections').split(",");
            var pages = util.getSessionStorage('pages').split(",");
            for(var i=0;i<sections.length;i++) {
                $("#" + sections[i]).removeClass("hidden");
            }
            for(var j=0;j<pages.length;j++){
                $("#"+pages[j]).removeClass("hidden");
            }
        }else if(util.getSessionStorage("userType")=="shop"){
            $("#expertManager,#expertAuditManager").removeClass("hidden"); //专家管理
        }
        $("#nick").html("<strong>"+util.getSessionStorage("userName")+"</strong>");
        $("#rightNick").html(util.getSessionStorage("userName"));
        $("#lastLoginTime").html(util.getSessionStorage("lastLoginTime"));
    }
    initPage();