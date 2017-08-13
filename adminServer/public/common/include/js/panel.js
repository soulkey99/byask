/**
 * Created by hjy on 2015/9/19 0019.
 */

    //退出登录
    function loginOut(){
        util.setSessionStorage("userID", "");
        util.setSessionStorage("userName", "");
        util.setSessionStorage("intro", "");
        util.setSessionStorage("remark", "");
        util.callServerFunction({},"logout", {}, function(data){
            if(data.code == 900){
                window.location.href = "../../login.html";
            }else{
                alert(data.code);
                window.location.href = "../../login.html";
            }
        },"POST");
    }

    //错误返回代码提示
    function errorCodeApi(errorCode){
        switch(errorCode){
            case 903: //token invalid
                $.confirm({
                    icon: 'icon icon-warning',
                    title: '提示信息',
                    content:"当前登录失效，请重新登录！",
                    confirmButton: '重新登陆',
                    cancelButton: '取消',
                    confirm: function(){
                        window.open('/admin', '_self');
                    }
                })
                break;
            case 905: //internal server error
                $.dialog({
                    icon: 'icon icon-warning',
                    title: '提示信息',
                    content:"please look message"
                })
                break;
            case 908:  //not authorized
                $.dialog({
                    icon: 'icon icon-warning',
                    title: '提示信息',
                    content:"管理员权限不足！"
                })
                break;
            default:
                $.dialog({
                    icon: 'icon icon-warning',
                    title: '提示信息',
                    content:"错误！"
                })
                break;
        }
    }

    //修改密码
    function initChangePassword(){
        var html = "<div class='form-group'>"+
            "</div>"+
            "<div class='form-group'>"+
            "<label>旧密码：</label><input type='password' class='form-control' id='oldPassword'>"+
            "</div>"+
            "<div class='form-group'>"+
            "<label>新密码：</label><input type='password' class='form-control' id='newPassword'>"+
            "</div>"+
            "<div class='form-group'>"+
            "<label>验证新密码：</label><input type='password' class='form-control' id='newPassword1'>"+
            "</div></div><button class='btn btn-primary' onclick='changePassword()'>提交修改</button>";
        dialog = $.dialog({
            icon: "icon icon-document-edit",
            title: '修改登录密码',
            content: html
        });
    }

    function changePassword(){
        if($("#oldPassword").val()==""){
            $.dialog({
                icon: 'icon icon-warning',
                title: '提示信息',
                content:"请输入旧密码！"
            })
        }else if($("#newPassword").val()==""){
            $.dialog({
                icon: 'icon icon-warning',
                title: '提示信息',
                content:"请输入新密码！"
            })
        }else if($("#newPassword1").val()==""){
            $.dialog({
                icon: 'icon icon-warning',
                title: '提示信息',
                content:"请再次输入新密码！"
            })
        }else if($("#newPassword").val()!=$("#newPassword1").val()){
            $.dialog({
                icon: 'icon icon-warning',
                title: '提示信息',
                content:"两次输入的新密码不同，请重新输入！"
            })
        }else{
            var postObj = {
                userID: util.getSessionStorage("userID"),
                authSign: util.getSessionStorage("authSign"),
                old_pwd: $("#oldPassword").val(),
                new_pwd: $("#newPassword").val()
            };
            util.callServerFunction('adminChangePwd',postObj, function(data){
                if(data.statusCode == 900){
                    dialog.close();
                    util.toast("修改密码成功！","success","系统提示");
                }else if(data.statusCode == 923){
                    $.dialog({
                        icon: 'icon icon-warning',
                        title: '提示信息',
                        content: '原密码不正确，请重新输入！'
                    });
                }else{
                    errorCodeApi(data.statusCode);
                }
            });
        }
    }
    var dialog = "";