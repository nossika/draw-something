import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:7869',
    timeout: 5000
});

request.interceptors.request.use(config => {
    config.params = Object.assign({
        timestamp: Date.now()
    }, config.params || {});
    return config;
});

request.interceptors.response.use(res => {
    let data = res.data;
    console.log(res.config.method + ' ' + res.config.url, data);
    return data;
}, err => Promise.reject(err));

export default request;