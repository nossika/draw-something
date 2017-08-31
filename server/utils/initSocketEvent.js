const util = require('./index');
const CLIENTS = global.CLIENTS;
const Client = require('../models/Client');

module.exports = (IO) => {
    setInterval(() => {
        IO.emit('roomList', util.getRoomList());
    }, 1000);
    IO.on('connection', client => {
        CLIENTS.set(client.id, new Client({
            client
        }));
        client.emit('roomList', util.getRoomList());
        client.on('disconnect', () => {
            CLIENTS.delete(client.id);
        });
    });
};

