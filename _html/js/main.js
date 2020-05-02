//function
function isLogin() {
    return $Storage.get('userToken') !== null
}

function isConnect() {
    return $Storage.get('server') !== null
}

function jump(path) {
    window.location.href = path;
}

function adminError(data) {
    $Storage.delete('userToken');
    $Storage.delete('userInfo');
    mdui.dialog({
        title: '权限错误',
        content: "服务器返回信息:\n" + JSON.stringify(data),
        buttons: [{
            text: '确定',
            onClick: () => {
                jump('./login.html');
            }
        }],

    });
}

function NError(data,jumpUrl) {
    mdui.dialog({
        title: '错误',
        content: "服务器返回信息:\n" + JSON.stringify(data),
        buttons: [{
            text: '确定',
            onClick: () => {
                jump(jumpUrl);
            }
        }],

    });
}
//class
class NStorage {
    now;
    constructor() {
        this.now = localStorage.getItem('now') ? localStorage.getItem('now') : 1;
    }

    get(mod){
        let obj = localStorage.getItem(mod);
        if(obj === null) return null;
        obj = JSON.parse(obj);
        return obj[this.now];
    }

    delete(mod){
        let data = JSON.parse(localStorage.getItem(mod));
        delete data[this.now];
        data = JSON.stringify(data);
        localStorage.setItem(mod,data);
        return 1
    }

    static async toServer(now) {
        now = isNaN(Number(now)) ? 1 :  Number(now);
        localStorage.setItem('now',now);
        location.reload();
    }

    static async addServer(server){
        let obj = await this.last('server');

        obj.mod[obj.last + 1] = server;
        localStorage.setItem('server',JSON.stringify(obj.mod));
        return obj.last + 1;
    }

    static async addServerInfo(serverInfo){
        let obj = await this.last('server');

        obj.mod[obj.last + 1] = serverInfo;
        localStorage.setItem('serverInfo',JSON.stringify(obj.mod));
        return obj.last + 1;
    }

    static async addUserInfo(userInfo){
        let obj = await this.last('userInfo');
        obj.mod[obj.last + 1] = userInfo;
        localStorage.setItem('userInfo',JSON.stringify(obj.mod));
        return obj.last + 1;
    }

    static async addUserToken(userToken){
        let obj = await this.last('userToken');
        obj.mod[obj.last + 1] = userToken;
        localStorage.setItem('userToken',JSON.stringify(obj.mod))
        return obj.last + 1;
    }

    static async last(mod){
        let obj;
        try {
            obj = JSON.parse(localStorage.getItem(mod));
            if(obj === null) obj = {};
        } catch (e) {
            obj = {};
        }

        let keys = Object.keys(obj);
        let pop = keys.pop();

        let last = isNaN(Number(pop)) ? 0 :  Number(pop);
        return {
            mod : obj,
            last : last,
        }
    }
}

//global
$ = mdui.JQ;
$Storage = new NStorage();

$(document).ajaxError(async (event, xhr, options)=>{
    $('#Login').removeAttr('disabled');
    $('#spinner').hide();
    mdui.dialog({
        title: '服务器错误',
        content: xhr.responseText,
    });
});

//main
$(() => {
    let flag = window.location.pathname.search('connect.html');
    let flag2 = window.location.pathname.search('login.html');
    let siteName = $Storage.get('serverInfo')  ? $Storage.get('serverInfo').siteName : '未连接';

    if(!isConnect()) {
        if(flag === -1) jump('./connect.html');
        return 1;
    }

    document.title = siteName + document.title;
    $("#head>div>a[class='mdui-typo-headline']").text(siteName);

    if(!isLogin()) {
        if(flag2 === -1) jump('./login.html');
    }

});