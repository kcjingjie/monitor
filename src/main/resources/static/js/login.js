/*监听enter事件*/
$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        login();
    }
});


function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    if (username == null || username ==''){
        toastr.warning('用户名不能为空!');
        return;
    }
    if (password == null || password ==''){
        toastr.warning('密码不能为空!');
        return;
    }
    $.ajax({
        url:"../login/login",
        data:{
            username:username,
            password:password
        },
        success:function (data) {
            if (data.success==true){
                window.location.href = 'index.html'
            }else {
                toastr.warning('用户名或者密码错误!');
            }
        },
        error:function (data) {
            toastr.warning('用户名或者密码错误!');
        }
    })
}