const koa = require('koa');
const app = new koa();
const koaRouter = require('koa-router');
const router = new koaRouter();
const IO = require('socket.io')();

global.IO = IO;
global.ROOMS_MAP = new Map();
global.CLIENTS_MAP = new Map();

global.CLIENTS_EMITTER = new Proxy(global.CLIENTS_MAP, {
    get (map, key) {
        let client = map.get(key);
        if (client) {
            return client.io.emit;
        } else {
            return () => {};
        }
    }
});

const initSocketEvent = require('./utils/initSocketEvent');

initSocketEvent(IO);

IO.listen(7777, () => {
    console.log(7777, 'ws port', Date.now());
});

app.use((ctx, next) => {
    console.log('receive request:', ctx);
    next();
});

const initRouter = require('./router');

initRouter(router);
app.use(router.routes());

app.use((ctx, next) => {
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.body = '404';
});

app.listen(7869, () => {
    console.log(7869, 'http port', Date.now());
});


