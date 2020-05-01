const login = async (ctx) => {
    ctx.response.body = $language.loginErr1;

    if ($post.name !== undefined && $post.pwd !== undefined) {

        ctx.response.body = await ctx.User.login($post.name,$post.pwd);
    }
};

const info = async (ctx) => {
    if(!(ctx.User.isLogin())){
        ctx.response.body = $language.isUserFalse;
        return 1;
    }

    ctx.response.body = await ctx.User.info($user.uid);
};


const history = {
    up: async (ctx) => {
        if(!(ctx.User.isLogin())){
            ctx.response.body = $language.isUserFalse;
            return 1;
        }

        if(empty($post,['xid','es','lt'])) throw $language.paramException;
        let param = isPosInt($post.xid,$post.es,$post.lt);

        let uid = $user.uid;
        $post.xid = param[0];
        $post.es = param[1];
        $post.lt = param[2];

        ctx.response.body = await ctx.User.History.up(uid,$post);
    },

    list: async (ctx) => {
        if(!(ctx.User.isLogin())){
            ctx.response.body = $language.isUserFalse;
            return 1;
        }

        let uid = $user.uid;
        let xid = $get.xid;

        if(xid > 0){
            ctx.response.body = await ctx.User.History.one(uid,xid);
            return 1;
        }

        $get.page =  $get.page === undefined ? 1 : $get.page;
        $get.total =  $get.total === undefined ? 10 : $get.total;

        let param = isPosInt($get.page, $get.total);
        let page = param[0];
        let total = param[1];

        ctx.response.body = await ctx.User.History.all(uid,page,total);
    }
};

module.exports = {
    login,
    info,
    history,
};