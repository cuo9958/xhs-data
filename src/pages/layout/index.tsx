import React, { Fragment } from 'react';
import Utils from '../../services/utils';
import url_configs from '../../routes/config';

import { Button, Dropdown } from 'rsuite';
import './index.less';

interface iProps extends iReactRoute {
    uname: string;
    isLogin(): boolean;
    check(): void;
}
interface IState {
    active: string;
    layout: boolean;
}

function Menus(item: any, onSelect: any, active: string) {
    if (item.hide) return;
    return (
        <li key={item.name} className={'menu_item' + (active === item.name ? ' active' : '')} onClick={() => onSelect(item.path)}>
            {item.icon && <i className={item.icon}></i>}
            {item.title}
        </li>
    );
}

export default class extends React.Component<iProps, IState> {
    constructor(props: any) {
        super(props);
        const curr = Utils.checkUrl(props.location.pathname);
        this.state = {
            active: curr.name,
            layout: !curr.hideLayout,
        };
    }

    render() {
        if (!this.state.layout) return this.props.children;
        return (
            <Fragment>
                <div id="sider">
                    <div id="menus">
                        <ul className="menu_bg">{url_configs.map((item, index) => Menus(item, this.onSelect, this.state.active))}</ul>
                    </div>
                    <div className="footer">
                        <a href="/">技术支持</a>
                    </div>
                </div>
                <div id="main">
                    <div className="top_menus flex-right">
                        <Button appearance="primary" size="xs" onClick={() => this.login()}>
                            测试
                        </Button>
                    </div>
                    <div className="height40"></div>
                    <div className="continer">{this.props.children}</div>
                </div>
            </Fragment>
        );
    }

    componentWillReceiveProps(pp: any) {
        const curr = Utils.checkUrl(pp.location.pathname);
        this.setState({
            active: curr.name,
            layout: !curr.hideLayout,
        });
        if (curr.title) document.title = curr.title + ' | 系统';
    }

    onSelect = (index: string) => {
        this.props.history.push(index);
    };
    login = () => {
        // this.props.history.push('/login');
    };
}
