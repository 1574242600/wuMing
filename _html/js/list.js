$(() => {
   let userToken = $Storage.get('userToken');
   let server = $Storage.get('server');
    let user = $Storage.get('userInfo');

    if(user.admin >= 4) $('#admin').show();

   $.ajax({
       method: 'GET',
       url: server + '/series/list/?token=' + userToken,
       dataType: 'json',
       success: async (data) => {
           if (data.code === 401){
               adminError(data);
               return 1;
           }

           if(data.code !== 200){
               NError(data,null)
           }

           echoList(data.data);
           $('#spinner').hide();
       }
   });
});

async function echoList(list) {
    if (list[0] === undefined) {
        console.log('$list undefined');
        return 0;
    }

    let name;
    let xid;
    let sid;
    let total;

    for (let key in list){
        name = list[key].name;
        xid = list[key].xid;
        sid = list[key].sid;
        total = list[key].total;
        $('#List').append(`
        <div class="mdui-col-xs-12 mdui-col-sm-6 mdui-col-md-4 mdui-col-lg-3">
        <div class="mdui-grid-tile">
            <a href="./video.html?xid=${xid}"><img src="./img/card.gif"/></a>
            <div class="mdui-grid-tile-actions">
                <div class="mdui-grid-tile-text">
                    <div class="mdui-grid-tile-title">${name}</div>
                    <div class="mdui-grid-tile-subtitle"><i class="mdui-icon material-icons">grid_on</i>${total}话</div>
                </div>
            </div>
        </div>
        </div>
        `)
    }
}

async function addSeries() {
    let server = $Storage.get('server');
    let userToken = $Storage.get('userToken');
    const spinner = $('#spinner');

    mdui.dialog({
        title: '添加系列',
        content:'<form class="mdui-textfield" id="addSeriesFrom"><input class="mdui-textfield-input mdui-m-b-2" name="sid" type="text" placeholder="父id" value="0" /><input class="mdui-textfield-input" name="name" type="url" placeholder="标题"/></form>',
        buttons: [{
            text: '添加',
            onClick: () => {
                spinner.show();
                let data = $('#addSeriesFrom').serializeArray();
                $.ajax({
                    method: 'POST',
                    url: server + `/admin/series/add/?token=${userToken}`,
                    dataType: 'json',
                    data: {
                        sid: data[0].value,
                        name: data[1].value,
                    },
                    success: (data) => {
                        let mes = '添加成功';

                        if(data.code !== 200){
                            mes = data.mes;
                        }

                        mdui.snackbar({
                            message: mes,
                            position: 'left-top',
                        });
                        spinner.hide();
                    }
                })
            }
        }]
    });

}