const util = require('./index');
const ROOMS = global.ROOMS;
const CLIENTS = global.CLIENTS;
const Client = require('../models/Client');

module.exports = (IO) => {
    setInterval(() => {
        IO.emit('roomList', util.getRoomList());
    }, 1000);
    IO.on('connection', client => {
        CLIENTS[client.id] = new Client(client);
        client.emit('roomList', util.getRoomList());
        client.on('disconnect', () => {
            Reflect.deleteProperty(CLIENTS, client.id);
        });
    });
};

