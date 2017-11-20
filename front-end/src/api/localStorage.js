const ls = window.localStorage;

export default {
    get (key) {
        let data = ls.getItem(key);
        if (!data) return null;
        try {
            data = JSON.parse(data);
            let expired = data.expired;
            if (expired && Date.now() > expired) {
                ls.removeItem(key);
                return null;
            }
            return data.value;
        } catch (e) {
            return null;
        }
    },
    set (key, value, expired) {
        let data = {
            value,
        };
        if (expired instanceof Date) {
            data.expired = +expired;
        } else if (typeof expired === 'number') {
            data.expired = Date.now() + expired;
        } else {
            data.expired = Date.now() + 7 * 24 * 60 * 60 * 1000;
        }
        ls.setItem(key, JSON.stringify(data));
    }
}