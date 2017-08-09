const koa = require('koa');
const app = new koa();
const koaRouter = require('koa-router');
const router = new koaRouter();
const io = require('socket.io')();

global.ROOMS = {};
global.CLIENTS = {};

const Client = require('./models/client');
const setRouter = require('./router');

io.on('connection', client => {
    new Client(client);
});
io.listen(7777, () => {
    console.log(7777, 'ws port');
});

app.use((ctx, next) => {
    console.log('request:', ctx);
    next();
});

setRouter(router);
app.use(router.routes());

app.use((ctx, next) => {
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.body = '404';
});

app.listen(7869, () => {
    console.log(7869, 'http port');
});


