const fs = require("fs");
const path = require('path');
const mime = require("mime");


const steam206 = async (ctx,videoPath) => {
    let Range = ctx.request.get('Range');
    let file = fs.statSync(videoPath);
    let fileSize = file.size;

    let parts = Range.replace(/bytes=/, "").split("-");
    let start = parts[0] ? Number(parts[0]) : 0;
    let end = parts[1] ? Number(parts[1]) : start + 1024 * 1024 * 3;
    end = end > fileSize - 1 ? fileSize - 1 : end;
    let chunksize = (end - start) + 1;

    let headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mime.getType(path.extname(videoPath)),
    };

    //console.log(headers);
    ctx.response.status = 206;
    ctx.set(headers);

    try {
        return fs.createReadStream(videoPath, {start, end})
    } catch (e) {
        ctx.response.status = 416;
        return $language.video416;
    }
};




module.exports = async (ctx) =>{
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    let vid = isNaN(Number($get.vid)) ? -1 : Number($get.vid);
    if(vid <= 0) throw $language.paramException;

    let path = await ctx.Video.getVideoPath(vid);

    if(path == null){
        ctx.response.body = $language.video404;
        return 0;
    }

    ctx.response.body = await steam206(ctx,path);
};