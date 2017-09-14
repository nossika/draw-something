const ROOMS_MAP = global.ROOMS_MAP;

const util = {
    getRoomList () {
        let list = [];
        for (let room of ROOMS_MAP.values()) {
            list.push({
                roomName: room.name,
                peopleCount: room.clients.size,
                owner: util.clientInfo(room.owner)
            });
        }
        return list;
    },
    getRoomInfo (roomName) {
        let room = ROOMS_MAP.get(roomName);
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
    },
    map2Obj (map) {
        let obj = {};
        for (let [key, value] of map.entries()) {
            obj[key] = value;
        }
        return obj;
    }
};

module.exports = util;