module.exports = router => {
    router.get('/list', (ctx, next) => {
        ctx.response.set('Access-Control-Allow-Origin', '*');
        ctx.body = {
            time: Date.now(),
            d: 'asd'
        };
    });
};