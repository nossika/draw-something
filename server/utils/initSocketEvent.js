const util = require('./index');
const CLIENTS_MAP = global.CLIENTS_MAP;
const Client = require('../models/Client');

module.exports = (IO) => {
    setInterval(() => {
        let roomList = util.getRoomList();
        for (let client of CLIENTS_MAP.values()) {
            if (client.room) continue;
            client.io.emit('roomList', roomList);
        }
    }, 1000);

    IO.on('connection', io => {
        let client = new Client({
            io
        });
        CLIENTS_MAP.set(io.id, client);
        io.emit('userData', util.clientData(client));
        io.emit('roomList', util.getRoomList());
    });
};

