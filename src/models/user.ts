import { observable, action } from 'mobx';
// import request from '../services/request';

interface iUser {
    uname: string;
    token: string;
}

class User {
    @observable uname = localStorage.getItem('ys_uname');
    @observable token = localStorage.getItem('ys_token');

    //email,nickname
    @action login = (db: iUser) => {
        this.uname = db.uname;
        localStorage.setItem('ys_uname', db.uname);
    };
    getToken() {
        return this.token;
    }
}
export default new User();
