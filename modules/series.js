const seriesList = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    let page = isNaN(Number($get.page)) ? 1 : Number($get.page);
    let total = isNaN(Number($get.total)) ? 10 : Number($get.total);
    if(page <= 0 || total <= 0) throw $language.paramException;

    ctx.response.body = Object.assign(
        await ctx.Series.seriesList(page,total),
        await ctx.Series.seriesListTotal()
    );
};

const esList = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    let xid = isNaN(Number($get.xid)) ? 0 : Number($get.xid);
    let sid = isNaN(Number($get.sid)) ? 0 : Number($get.sid);
    if(xid <= 0 || sid < 0) throw $language.paramException;

    ctx.response.body = await ctx.Series.seriesEsList(xid, sid);
};

const videoUrl = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    let vid = isNaN(Number($get.vid)) ? 0 : Number($get.vid);
    if(vid <= 0) throw $language.paramException;

    ctx.response.body = await ctx.Series.queryEsVideo(vid);
};


module.exports = {
    seriesList,
    esList,
    videoUrl
};