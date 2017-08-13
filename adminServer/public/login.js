/**
 * Created by hjy on 2016/6/30 0030.
 */

/**
 * Created by MengLei on 2015/8/3.
 */

//记住密码
function rember(){
    $("#inputUserName").val(util.getSessionStorage("userName"));
    $("#inputPassword").val(util.getSessionStorage("passwd"));
}

//登陆
function signIn(){
    var postData = {userName: $('#inputUserName').val(), passwd: $('#inputPassword').val()};
    if($("#rember").is(':checked')){
        util.setSessionStorage("userName", $('#inputUserName').val());
        util.setSessionStorage("passwd", $('#inputPassword').val());
    }else{
        localStorage.clear();
    }
    util.callServerFunction({},"login", postData, function(data){
        switch (data.code){
            case 900:
                console.log(data);
                util.setSessionStorage('userID', data.info.userID);
                util.setSessionStorage('userName', data.info.userName);
                util.setSessionStorage('intro', data.info.intro);
                util.setSessionStorage('remark', data.info.remark);
                util.setSessionStorage('sections', data.info.sections);
                util.setSessionStorage('userType', data.info.type);
                window.location.href = 'admin/indexMDL.html';
                break;
            default :
                if(dialog != null){
                    dialog.close();
                    dialog = null;
                }else{
                    dialog = $.dialog({
                        icon: 'icon icon-warning',
                        title: '提示信息',
                        content:"请输入正确的用户名和密码！"
                    })
                }
                break;
        }
    },"POST");
}
var dialog = null;
document.onkeydown=function(event){
    e = event ? event :(window.event ? window.event : null);
    if(e.keyCode==13){
        signIn();
    }
}
rember();