const koa = require('koa');
const app = new koa();
const koaRouter = require('koa-router');
const router = new koaRouter();
const IO = require('socket.io')();

global.IO = IO;
global.ROOMS = {};
global.CLIENTS = {};

const Client = require('./models/client');
const setRouter = require('./router');
const util = require('./utils');
const event = require('./models/event');

IO.on('connection', client => {
    CLIENTS[client.id] = new Client(client);
    client.emit('roomList', util.getRoomList());
    client.on('disconnect', () => {
        Reflect.deleteProperty(CLIENTS, client.id);
    });
});

setInterval(event.sendRoomList, 2000);

IO.listen(7777, () => {
    console.log(7777, 'ws port', Date.now());
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
    console.log(7869, 'http port', Date.now());
});


