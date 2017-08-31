const ROOMS = global.ROOMS;

const util = {
    getRoomList () {
        let list = [];
        for (let roomName in ROOMS) {
            let room = ROOMS[roomName];
            list.push({
                roomName,
                peopleCount: room.clients.size,
                owner: util.clientInfo(room.owner)
            });
        }
        return list;
    },
    getRoomInfo (roomName) {
        let room = ROOMS[roomName];
        return {
            people: Array.from(room.clients).map(client => (util.clientInfo(client))),
            owner: util.clientInfo(room.owner)
        }
    },
    clientInfo (client) {
        if (!client) return null;
        return {
            id: client.id,
            info: client.info
        }
    }
};

module.exports = util;