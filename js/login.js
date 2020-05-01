

$('#Login').on('click', function () {
    $('#Login').attr('disabled','disabled');
    $('#spinner').show();
    let server = $Storage.get('server');
    let form = $('form').serializeArray();
    let name = form[0].value;
    let pwd = form[1].value;

    $.ajax({
        method: 'POST',
        url: server + '/user/login',
        dataType: 'json',
        data: {
          name: name,
          pwd: pwd
        },
        success: async (data) => {
            if(data.code === 400){
                mdui.dialog({
                    title: '登录失败',
                    content: data.mes,
                    buttons: [{
                            text: '确定'
                    }],
                });
                $('#Login').removeAttr('disabled');
                $('#spinner').hide();
                return 0;
            }

            NStorage.addUserToken(data.userToken);

            $('#spinner').hide();
            mdui.dialog({
                title: '登录成功',
                content: "正在跳转........",
            });

            userInfo(data.userToken);
        }
    });

});

function userInfo(userToken) {
    let server = $Storage.get('server');
    $.ajax({
        method: 'GET',
        url: server + '/user/info?token=' + userToken,
        dataType: 'json',
        success: async (data) => {
            if (data.code !== 200) {
                mdui.dialog({
                    title: '获取用户信息失败',
                    content: data.mes,
                    buttons: [{
                        text: '确定'
                    }],
                });
                return 0;
            }

            NStorage.addUserInfo(data.data);
            jump('./list.html');
        }
    })
}

$('#spinner').hide();