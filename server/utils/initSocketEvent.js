const util = require('./index');
const CLIENTS_MAP = global.CLIENTS_MAP;
const Client = require('../models/Client');

module.exports = (IO) => {
    setInterval(() => {
        IO.emit('roomList', util.getRoomList());
    }, 1000);
    IO.on('connection', client => {
        CLIENTS_MAP.set(client.id, new Client({
            client
        }));
        client.emit('userData', util.clientData(client));
        client.emit('roomList', util.getRoomList());
    });
};

