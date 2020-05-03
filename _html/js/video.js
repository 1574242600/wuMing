let dp;
const url = new URL(window.location);
const qurey = new URLSearchParams(url.search);
const $xid = qurey.get('xid');

let $list;  //话列表
let $es = 1;    //当前话数
let $IntervalId;
let $lastTime; //上次播放进度等

$(() => {
    let userToken = $Storage.get('userToken');
    let server = $Storage.get('server');
    let user = $Storage.get('userInfo');

    if(user.admin >= 4) $('#admin').show();

    $.ajax({
    method: 'GET',
    url: server + `/series/es/list/?token=${userToken}&xid=${$xid}`,
    dataType: 'json',
    success: async (data) => {
        if (data.code === 401){
            adminError(data);
            return 1;
        }

        if(data.code !== 200){
            NError(data,'./list.html')
        }

        if(JSON.stringify(data.data) ===  '[]') {
            mdui.dialog({
                title: '错误',
                content: '系列不存在',
                buttons: [{
                    text: '确定',
                    onClick: () => {
                        jump('./list.html');
                    }
                }],
            });
        }

        getPlayLastTime()
        $list = data.data;
        play($es);
        echoList(data.data);

        $('#spinner').hide();
    }})

})


async function play(es) {
    listActive(es);
    $es = es;
    let vid = $list[es - 1].vid;

    let server = $Storage.get('server');
    let userToken = $Storage.get('userToken');

    $.ajax({
        method: 'GET',
        url: server + `/series/es/videoUrl/?token=${userToken}&vid=${vid}`,
        dataType: 'json',
        success: async (data) => {
            if (dp instanceof Object) {
                window.clearInterval($IntervalId);
                dp.destroy();
            }

            let video = {
                quality: [
                    {
                        name: '外部',
                        url: data.data.url,
                    },
                    {
                        name: '本地',
                        url: server + data.data.localUrl,
                    },
                ],
                defaultQuality: 0,
            };

            dp = new DPlayer({
                container: document.getElementById('dplayer'),
                video: video,
            });


            dp.on('play', function() {
                if($lastTime.ok !== 1) {
                    mdui.snackbar({
                        message: `上次观看到第${$lastTime.es}话 ${dateString($lastTime.lt)} 是否跳转`,
                        buttonText: '跳转',
                        position: 'left-top',
                        onButtonClick: toPlayLastTime,
                    });
                    $lastTime.ok = 1;
                }

                $IntervalId = window.setInterval(() => {
                    upHistory(Math.ceil(dp.video.currentTime))
                },3000)
            });

            dp.on('pause', function() {
                window.clearInterval($IntervalId);
            });
        }
    })
}



async function echoList(data){
    let es;
    let name;
    let vid;
    let esList = $('#esList');

    if(window.screen.width <= 1024){
        echoListSm(data);
        return 0;
    }

    for (let key in data){
        es = data[key].es;
        name = data[key].name;
        vid = data[key].vid;

        if(key === '0'){
            esList.append(`
                 <a id="list-${key}" href="javascript:play(${es})" class="mdui-list-item mdui-ripple mdui-list-item-active">${es}-${name}</a>
            `)
            continue;
        }

        esList.append(`
            <a id="list-${key}" href="javascript:play(${es})" class="mdui-list-item mdui-ripple">${es}-${name}</a>
        `)
    }
}

async function echoListSm(data){
    let es;
    let name;
    let vid;
    let esList = $('#esList-sm');

    for (let key in data){
        es = data[key].es;
        name = data[key].name;
        vid = data[key].vid;

        if(key === '0'){
            esList.append(`
                <div id="list-${key}" class="mdui-card mdui-list-item-active mdui-m-r-2" style="width:100px;float: left"  onclick="play(${es})"><div><div class="mdui-m-b-1 mdui-m-t-1 mdui-m-l-1">第${es}话</div><div class="mdui-m-l-1 mdui-m-b-1" style="opacity:.52">${name}</div></div></div>
            `)
            continue;
        }

        esList.append(`
                <div id="list-${key}" class="mdui-card mdui-m-r-2" style="width:100px;float: left"  onclick="play(${es})"><div><div class="mdui-m-b-1 mdui-m-t-1 mdui-m-l-1">第${es}话</div><div class="mdui-m-l-1 mdui-m-b-1" style="opacity:.52">${name}</div></div></div>
        `)
    }
    esList.attr('style',`width: ${es * 100 + es * 16}px`)
}



async function upHistory(lt){
    let server = $Storage.get('server');
    let userToken = $Storage.get('userToken');

    $.ajax({
        method: 'POST',
        url: server + `/user/history/up/?token=${userToken}`,
        data:{
            xid: $xid,
            es: $es,
            lt: lt
        },
    })
}

async function listActive(es) {
    $(`#list-${$es - 1}`).removeClass('mdui-list-item-active');
    $(`#list-${es - 1}`).addClass('mdui-list-item-active')
}

async function getPlayLastTime() {
    let server = $Storage.get('server');
    let userToken = $Storage.get('userToken');

    $.ajax({
        method: 'GET',
        url: server + `/user/history/list/?token=${userToken}&xid=${$xid}`,
        dataType: 'json',
        success:(data) => {
            if (JSON.stringify(data.data) === '[]'){
                $lastTime = null;
                return 1;
            }

            $lastTime = data.data;
        }
    })
}



function toPlayLastTime() {

    if ($lastTime.es !== $es){
        play($lastTime.es);
    }

    setTimeout(() => {
        dp.seek($lastTime.lt);
        dp.notice('已跳转到上次观看进度',3000);
    },1500)

}

function dateString(s) {
    if(s < 60){
        return `${s}秒`;
    }

    let min = Math.ceil(s / 60);
    s = s % 60;

    return `${min}分${s}秒`;
}

async function addEs() {
    let server = $Storage.get('server');
    let userToken = $Storage.get('userToken');
    const spinner = $('#spinner');

    mdui.dialog({
        title: '添加单集',
        content:'<form class="mdui-textfield" id="addEsFrom"><input class="mdui-textfield-input mdui-m-b-2" name="title" type="text" placeholder="标题"/><input class="mdui-textfield-input mdui-m-b-2" name="url" type="url" placeholder="url"/><input class="mdui-textfield-input" name="file" type="text" placeholder="路径"/></form>',
        buttons: [{
            text: '添加',
            onClick: () => {
                spinner.show();
                let data = $('#addEsFrom').serializeArray();

                $.ajax({
                    method: 'POST',
                    url: server + `/admin/es/add/?token=${userToken}`,
                    dataType: 'json',
                    data: {
                        xid: $xid,
                        name: data[0].value,
                        url: data[1].value,
                        file: data[2].value
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