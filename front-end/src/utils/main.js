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