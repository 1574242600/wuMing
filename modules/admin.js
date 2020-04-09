const addUser = async (ctx) =>{
    const post = ctx.request.body;
    const is = () => {
        if (post.name.length < -1 || !post.pwd < -1) return true;
        if (post.name.length > 32) return true;
        return isNaN(Number(post.admin));
    };

    if(is()) throw language.paramException;
    ctx.response.body = await ctx.Admin.addUser(post);
};


const addSeries = async (ctx) =>{
    const post = ctx.request.body;
};



module.exports = {
    addUser,
    addSeries
};