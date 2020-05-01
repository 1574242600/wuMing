const seriesList = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    $get.page =  $get.page === undefined ? 1 : $get.page
    $get.total =  $get.total === undefined ? 20 : $get.total

    let param = isPosInt($get.page,$get.total);
    let page = param[0];
    let total = param[1];

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

    let param = isPosInt($get.xid);
    let xid = param[0];

    ctx.response.body = await ctx.Series.seriesEsList(xid);
};

const videoUrl = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    let param = isPosInt($get.vid);
    let vid = param[0];

    ctx.response.body = await ctx.Series.queryEsVideo(vid);
};


module.exports = {
    seriesList,
    esList,
    videoUrl
};