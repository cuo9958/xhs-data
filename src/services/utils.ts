import PathRegexp from 'path-to-regexp';
import url_configs from '../routes/config';
import urlParse from 'url-parse';

function DateFormart(time: Date, formart = 'yyyy-MM-dd hh:mm:ss') {
    formart = formart.replace('yyyy', time.getFullYear() + '');
    formart = formart.replace('MM', (time.getMonth() + 1 + '').padStart(2, '0'));
    formart = formart.replace('dd', (time.getDate() + '').padStart(2, '0'));
    formart = formart.replace('hh', (time.getHours() + '').padStart(2, '0'));
    formart = formart.replace('mm', (time.getMinutes() + '').padStart(2, '0'));
    formart = formart.replace('ss', (time.getSeconds() + '').padStart(2, '0'));
    return formart;
}

export default {
    checkUrl(url: string) {
        const curr = url_configs.find((item) => PathRegexp(item.path).test(url));
        if (!curr) return url_configs[0];
        return curr;
    },
    parseParams(url: string) {
        return urlParse(url, true);
    },
    DateFormartNumber: (ts: number, formart = 'yyyy-MM-dd hh:mm:ss') => {
        if (!ts || isNaN(ts)) return '';
        const time = new Date(ts);
        return DateFormart(time, formart);
    },
    DateFormartString: (ts: string, formart = 'yyyy-MM-dd hh:mm:ss') => {
        const time = new Date(ts);
        return DateFormart(time, formart);
    },
    style2str(type: string) {
        if (type === 'z1') return '温馨简欧（居家型）';
        if (type === 'z2') return '简约使用（经济型）';
        if (type === 'z3') return '舒适婚房（功能型）';
        if (type === 'z4') return '高端精装（奢华型）';
        return '';
    },
};
