

$('#Connect').on('click', function () {
    $('#Connect').attr('disabled','disabled');
    let server = $('form').serializeArray()[0].value;
    $('#spinner').show();

    $.ajax({
        method: 'GET',
        url: server + '/ddlc/',
        dataType: 'json',
        success: async (data) => {
            if(data.code !== 200){
                mdui.dialog({
                    title: '这可能是个假的服务器,233333',
                    content: "服务器返回信息:\n" + JSON.stringify(data),
                    buttons: [{
                        text: '确定'
                    }],
                });
                $('#Connect').removeAttr('disabled');
                $('#spinner').hide();
                return 0;
            }

            NStorage.addServer(server);
            NStorage.addServerInfo(data.data);

            $('#spinner').hide();
            mdui.dialog({
                title: '连接成功',
                content: "正在跳转登录页面........",
            });

            jump('./login.html');
        }
    });

});

$('#spinner').hide();