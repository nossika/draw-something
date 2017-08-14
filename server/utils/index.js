const ROOMS = global.ROOMS;

module.exports = {
    getRoomList () {
        let list = {};
        for (let room in ROOMS) {
            list[room] = ROOMS[room].size;
        }
        return list;
    }
};