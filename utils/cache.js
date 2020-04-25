class cache {
    static defaultKey = 'default';
    static maxLength = 10;

    static async get(name,key) {
        key = key ? key : this.defaultKey;
        if ($cacheObj[key] === undefined) return null;
        return $cacheObj[key][name] ? $cacheObj[key][name] : null ;
    }

    static async set(name,data,key){
        key = key ? key : this.defaultKey;
        if($cacheObj[key] === undefined) $cacheObj[key] = {};

        let keys = Object.keys($cacheObj[key]);
        let len = keys.length;
        if (len >= this.maxLength) {
            let name = keys.shift();
            delete $cacheObj[key][name];
        }
        $cacheObj[key][name] = data;
        return 1;
    }
}



module.exports = () => {
    $cacheObj[cache.defaultKey] = {};
    return cache;
} ;