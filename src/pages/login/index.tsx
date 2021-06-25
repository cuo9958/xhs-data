import React from 'react';
import { inject } from 'mobx-react';
import { Button, Input, Alert } from 'rsuite';
import './index.less';
import Request from '../../services/request';

import Background from './background';

interface iProps extends iReactRoute {
    login(data: any): void;
}
interface iState {
    uname: string;
    pwd: string;
}

export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            uname: '',
            pwd: '',
        };
    }

    render() {
        return (
            <Background>
                <div className="box">
                    <div className="title">
                        <span>后&nbsp;台&nbsp;|&nbsp;账&nbsp;号&nbsp;登&nbsp;录</span>
                        <div className="sm">登录即可管理你的项目</div>
                    </div>
                    <div className="content">
                        <Input placeholder="用户名" onChange={(e: any) => this.setState({ uname: e })} />
                        <Input placeholder="至少6位密码" type="password" onChange={(e: any) => this.setState({ pwd: e })} />
                        <Button onClick={this.login} className="login_btn" type="info">
                            登录
                        </Button>
                    </div>
                </div>
            </Background>
        );
    }

    login = async () => {
        try {
            Alert.success('登录成功');
            this.props.history.push('/dash');
        } catch (error) {
            console.log(error);
            Alert.error(error.message);
        }
    };
}
