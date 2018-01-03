function generateUUID (len = 20) {
    let chars = '_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charsLen = chars.length;
    let UUID = '';
    while (len--) {
        UUID += chars[Math.random() * charsLen | 0];
    }
    return UUID;
}

const util = {

};


export default util;

export function getPersonName (person) {
    return person ? (person.info.name || person.id) : '';
}
export function random (to, begin = 0) {
    to = to | 0;
    begin = begin | 0;
    return (Math.random() * (to - begin) | 0) + begin;
}