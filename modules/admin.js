const addUser = async (ctx) =>{
    const is = () => {
        if (empty(post,['name','pwd'])) return true;
        if (post.name.length > 32) return true;
        return isNaN(Number(post.admin));
    };

    if(is()) throw language.paramException;
    ctx.response.body = await ctx.Admin.addUser(post);
};


const addSeries = async (ctx) =>{
    if(empty(post,['name','sid'])) throw language.paramException;
    const sid = isNaN(Number(post.sid)) ? 0 : Number(post.sid);

    ctx.response.body = await ctx.Admin.addSeries(post.name,sid);
};

const addEs = async (ctx) =>{

    ctx.response.body = await ctx.Admin.addSeries(post.name,sid);
};


module.exports = {
    addUser,
    addSeries
};