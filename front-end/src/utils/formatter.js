function fillZero (num) {
    num = +num;
    return num <= 9 ? '0' + num : '' + num;
}

export const getFormatTime = (date, mode) => {
    if (!date) return '';
    date = new Date(date);
    let [Y, M ,D] = [
        date.getFullYear(),
        fillZero(date.getMonth() + 1),
        fillZero(date.getDate())
    ];
    let [h, m ,s] = [
        fillZero(date.getHours()),
        fillZero(date.getMinutes()),
        fillZero(date.getSeconds())
    ];
    if (mode === 'HMS') {
        return `${h}:${m}:${s}`;
    } else if (mode === 'YMD') {
        return `${Y}-${M}-${D}`;
    }
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};

