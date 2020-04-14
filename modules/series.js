const list = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = language.isUserFalse;
        return 1;
    }

    let page = isNaN(Number(get.page)) ? 1 : Number(get.page);
    let total = isNaN(Number(get.total)) ? 10 : Number(get.total)

    return ctx.response.body = Object.assign(
        await ctx.Series.seriesList(page,total),
        await ctx.Series.seriesListTotal()
    );
};

module.exports = {
    list
};