const ROOMS = global.ROOMS;

module.exports = {
    getRoomList () {
        let list = {};
        for (let room in ROOMS) {
            list[room] = ROOMS[room].size;
        }
        return list;
    },
    getRoomInfo (room) {
        let set = ROOMS[room];
        return set ? Array.from(set).map(item => ({
            id: item.id,
            info: item.info
        })) : [];
    }
};