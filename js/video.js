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
            NError(data,'./$list.html')
        }

        if(JSON.stringify(data.data) === ('{}' || '[]')) {
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






//todo url 播放
async function play(es) {
    listActive(es);
    $es = es;
    let vid = $list[es - 1].vid;

    let server = $Storage.get('server');
    let userToken = $Storage.get('userToken');
    let url = server + '/localVideo/?token=' + userToken +'&vid=' + vid;
    let video = {
        url: url,
    };

    if(dp instanceof Object) {
        window.clearInterval($IntervalId);
        dp.switchVideo(video);
        return 1;
    }

    dp = new DPlayer({
        container: document.getElementById('dplayer'),
        video: video,
    });


    dp.on('play', function() {
        $IntervalId = window.setInterval(() => {
            upHistory(Math.ceil(dp.video.currentTime))
        },3000)
    });

    dp.on('pause', function() {
        window.clearInterval($IntervalId);
    });
}



async function echoList(data){
    let es;
    let name;
    let vid;
    let esList = $('#esList');

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
    if($lastTime === null){
        dp.notice('你别玩我，你分明就没看过',3000);
        return 0;
    }

    if ($lastTime.es !== $es){
        play($lastTime.es);
    }

    dp.seek($lastTime.lt);
    dp.notice('已跳转到上次观看进度',3000);

}