import axios from 'axios';
import JSON5 from 'json5';
import UserModels from '../models/user';

axios.defaults.timeout = 5000;

const server = axios.create();

const encoded = (data: any) => {
    if (typeof data === 'string') return encodeURIComponent(data);
    if (typeof data === 'object') {
        let params = [];
        for (let k in data) {
            if (!data.hasOwnProperty(k)) return;
            params.push(`${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`);
        }
        return params.join('&');
    }
    return data;
};
class RequestError extends Error {
    constructor(name: string, code: number, msg: string) {
        super(name);
        this.code = code;
        this.msg = msg;
    }
    code: number;
    msg: string;
}
/**
 * 自定义请求库
 */
class Request {
    async _fetch(url: string, opts: any) {
        let res;
        try {
            opts.url = url;
            res = await server(opts);
        } catch (e) {
            console.warn('网络错误', e);
            throw new Error('网络连接失败，请检查网络权限');
        }
        return res;
    }
    async _request(url: string, opts: any) {
        if (url.indexOf('http') !== 0) url = '/api' + url;
        let res = await this._fetch(url, opts);
        this._checkStatus(res, url);
        let json = res.data;
        this._checkServerCode(json);
        return json.data;
    }
    _checkStatus(resp: any, url: string) {
        if (resp.status !== 200) {
            throw new Error('网络连接失败，请检查网络');
        }
    }
    async _parseJSON(resp: any) {
        let json = {};
        try {
            const txt = resp.data;
            json = JSON5.parse(txt);
        } catch (e) {
            console.warn('响应数据格式错误', e);
            throw new Error('连接失败，请重试');
        }
        return json;
    }
    _checkServerCode(json: any) {
        if (json.code === -1) {
            window.location.href = '/#/login';
            return;
        }
        if (json.code !== 1) {
            console.log('返回状态报错', json.code);
            throw new RequestError(json.msg, json.code, json.data);
        }
    }
    getHeaders(ispost = false) {
        let headers: any = {};
        const token = UserModels.getToken();
        if (token) headers.token = token;
        headers.uname = UserModels.uname;
        return headers;
    }

    async get(url: string, data: any = {}) {
        if (data) data = encoded(data);
        if (url.indexOf('?') < 0 && data) {
            url += '?' + data;
        } else if (data) {
            url += '&' + data;
        }
        return this._request(url, {
            method: 'GET',
            credentials: 'include',
            headers: this.getHeaders(),
        });
    }
    async del(url: string, data: any = {}) {
        if (data) data = encoded(data);
        if (url.indexOf('?') < 0 && data) {
            url += '?' + data;
        } else if (data) {
            url += '&' + data;
        }
        return this._request(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: this.getHeaders(),
        });
    }
    async post(url: string, data: any = {}) {
        return this._request(url, {
            method: 'POST',
            credentials: 'include',
            headers: this.getHeaders(true),
            data: encoded(data),
        });
    }

    async upload(url: string, data: any) {
        return this._request(url, {
            method: 'POST',
            credentials: 'include',
            headers: this.getHeaders(true),
            data: data,
        });
    }
}

export default new Request();
