const koa = require('koa');
const app = new koa();
const koaRouter = require('koa-router');
const router = new koaRouter();
const io = require('socket.io')();

global.IO = io;
global.ROOMS = {};
global.CLIENTS = {};

const Client = require('./models/client');
const setRouter = require('./router');

io.on('connection', client => {
    CLIENTS[client.id] = new Client(client);
    client.emit('roomList', (() => {
        let data = {};
        for (let room in ROOMS) {
            data[room] = ROOMS[room].size;
        }
        return data;
    })());
    client.on('disconnect', () => {
        Reflect.deleteProperty(CLIENTS, client.id);
    });
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


