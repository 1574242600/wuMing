const fs = require("fs");
const Path = require('path');

const addUser = async (ctx) => {
    const is = () => {
        if (empty($post,['name','pwd'])) return true;
        if ($post.name.length > 32) return true;
        return isNaN(Number($post.admin));
    };

    if(is()) throw $language.paramException;
    ctx.response.body = await ctx.Admin.addUser($post);
};


const addSeries = async (ctx) =>{
    if(empty(post,['name','sid'])) throw $language.paramException;
    const sid = isNaN(Number(post.sid)) ? 0 : Number($post.sid);

    ctx.response.body = await ctx.Admin.addSeries($post.name,sid);
};

const addEsAndVideo = async (ctx) =>{
    if(empty($post,['xid','name'])) throw $language.paramException;

    let flag = empty($post,['file']);
    let flag2 = empty($post,['url']);
    if(flag && flag2) throw $language.paramException;

    if (!flag) await isVideo($post.file);

    ctx.response.body = await ctx.Admin.addEsAndVideo($post.xid,$post.name,$post);
    //todo url检查
};


module.exports = {
    addUser,
    addSeries,
    addEsAndVideo,
};


async function isVideo(path) {
    let t = Path.extname(path).toLowerCase();

    switch (t) {
        case '.mp4':
            break;
        case '.flv':
            break;
        default:
            throw $language.addVideoException;
    }

    let stat = fs.statSync(path);

    if(stat.isFile() !== true) throw $language.addVideoException;
}
