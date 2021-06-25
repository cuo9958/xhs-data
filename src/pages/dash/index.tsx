/**
 * 首页
 */
import React from 'react';
import './index.less';
import { Table, Button, Alert, Input, Form, FormGroup, FormControl, ControlLabel } from 'rsuite';
import { goDown, setLister, goExcel } from '../../services/msg';

const { Column, HeaderCell, Cell } = Table;

interface iState {
    data: string;
    list: IList[];
    time_number: string;
    tableLoading: boolean;
}
interface IList {
    href: string;
    title: string;
    pub_time: string;
    zan: string;
    cang: string;
    talk: string;
    label: string;
    main: string;
    name: string;
    fans: string;
    zancang: string;
    state: number;
}
export default class extends React.Component<iReactRoute, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: '',
            list: [],
            time_number: '5000',
            tableLoading: false,
        };
    }

    render() {
        return (
            <div id="dash">
                <div className="top">
                    <Input onChange={(e: any) => this.setState({ data: e })} componentClass="textarea" rows={8} placeholder="请输入链接，每行一条" />
                </div>
                <div className="form">
                    <Form layout="inline">
                        <FormGroup>
                            <Button onClick={() => this.start()} className="btn_add" type="primary">
                                开始处理
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <Button onClick={() => this.stop()} className="btn_add" type="primary">
                                结束
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <Button onClick={() => this.dowmload()} className="btn_add" type="primary">
                                下载
                            </Button>
                        </FormGroup>
                    </Form>
                </div>

                <div>
                    <Table data={this.state.list} autoHeight bordered cellBordered wordWrap>
                        <Column width={300}>
                            <HeaderCell>链接</HeaderCell>
                            <Cell dataKey="href" />
                        </Column>

                        <Column>
                            <HeaderCell>标题</HeaderCell>
                            <Cell dataKey="title" />
                        </Column>
                        <Column>
                            <HeaderCell>发布时间</HeaderCell>
                            <Cell dataKey="pub_time" />
                        </Column>
                        <Column>
                            <HeaderCell>点赞数</HeaderCell>
                            <Cell dataKey="zan" />
                        </Column>
                        <Column>
                            <HeaderCell>收藏数</HeaderCell>
                            <Cell dataKey="cang" />
                        </Column>
                        <Column>
                            <HeaderCell>评论数</HeaderCell>
                            <Cell dataKey="talk" />
                        </Column>
                        <Column>
                            <HeaderCell>标签</HeaderCell>
                            <Cell dataKey="label" />
                        </Column>
                        <Column>
                            <HeaderCell>主页</HeaderCell>
                            <Cell dataKey="main" />
                        </Column>
                        <Column>
                            <HeaderCell>昵称</HeaderCell>
                            <Cell dataKey="name" />
                        </Column>
                        <Column>
                            <HeaderCell>粉丝数</HeaderCell>
                            <Cell dataKey="fans" />
                        </Column>
                        <Column>
                            <HeaderCell>赞藏数</HeaderCell>
                            <Cell dataKey="zancang" />
                        </Column>
                        <Column fixed="right">
                            <HeaderCell>状态</HeaderCell>
                            <Cell>
                                {(rowData: any) => {
                                    if (rowData.state === 0) return '等待';
                                    if (rowData.state === 1) return '完成';
                                    if (rowData.state === 3) return '抓取中';
                                    if (rowData.state === 2)
                                        return (
                                            <Button onClick={() => this.retry(rowData.href)} appearance="primary">
                                                重试
                                            </Button>
                                        );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </div>
            </div>
        );
    }
    componentDidMount() {
        setLister(this.onend.bind(this));
    }
    start() {
        console.log('开始');
        const str = this.state.data.trim().replace(/，/g, ',').replace(/\n/g, ',').replace(/\s+/g, ',');
        const str_list = str.split(',');
        const list: IList[] = [];
        str_list.forEach((item) => {
            if (item) list.push({ href: item, state: 0, title: '', pub_time: '', zan: '', cang: '', talk: '', label: '', main: '', name: '', fans: '', zancang: '' });
        });
        this.setState({ list, tableLoading: true }, () => {
            this.begin = true;
            this.exec();
        });
    }
    begin = false;
    exec() {
        if (this.begin == false) return;
        const item = this.state.list.find((obj) => obj.state == 0);
        if (item) {
            item.state = 3;
            goDown(item.href);
        } else {
            this.stop();
        }
    }
    stop() {
        this.begin = false;
        this.setState({ tableLoading: false });
        Alert.success('已完成');
    }
    retry(href: string) {
        const list = this.state.list;
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            if (item.href === href) {
                item.state = 0;
            }
        }
        this.forceUpdate();
    }
    onend = (data: any) => {
        console.log('结束', data);
        const list = this.state.list;
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            if (item.href === data.href) {
                list[index] = data;
            }
        }
        this.forceUpdate();
        setTimeout(() => {
            this.exec();
        }, 2000);
    };

    dowmload() {
        console.log('下载');
        goExcel(this.state.list);
    }
}
