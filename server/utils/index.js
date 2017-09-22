const ROOMS_MAP = global.ROOMS_MAP;
const CLIENTS_MAP = global.CLIENTS_MAP;

const util = {
    getRoomList () {
        let list = [];
        for (let room of ROOMS_MAP.values()) {
            list.push({
                roomName: room.name,
                peopleCount: room.clientIdList.size,
                owner: util.clientInfo(room.owner)
            });
        }
        return list;
    },
    getRoomInfo (roomName) {
        let room = ROOMS_MAP.get(roomName);
        if (!room) {
            return null;
        }
        return {
            people: Array.from(room.clientIdList).map(clientId => (util.clientInfo(CLIENTS_MAP.get(clientId)))),
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