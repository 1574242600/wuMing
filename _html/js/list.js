$(() => {
   let userToken = $Storage.get('userToken');
   let server = $Storage.get('server');
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