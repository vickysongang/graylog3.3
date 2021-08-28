import React from 'react';
import Reflux from 'reflux';
import {MonitorActions, MonitorStore} from 'stores/MonitorStore';
import {Spinner} from 'components/common';
import {Table} from 'react-bootstrap';
import createReactClass from 'create-react-class';
import {Row} from 'components/graylog';

const MonitorRequestDetail = createReactClass({
    mixins: [Reflux.connect(MonitorStore)],

    componentWillMount() {
        MonitorActions.getKongLogParams()
    },

    componentDidMount() {
        this.loadDatas();
        this.timer = setInterval(() => {
            console.log("60s刷新数据...");
            this.loadDatas()
        }, 60000);
    },

    loadDatas() {
        let timeoutCondition = this.state.kongLogParams.timeout_condition
        let errorCondition = this.state.kongLogParams.error_condition
        let {keyword, logType, client_app_name} = this.props.location.query
        keyword = keyword || '1 day ago';
        let uniqueKey = logType + "_" + keyword.replace(/ /g, "_") + "_request_detail";
        let query = 'type:' + logType;
        if (client_app_name) {
            uniqueKey = logType + "_" + client_app_name + "_" + keyword.replace(/ /g, "_") + "_request_detail";
            query += ' AND client_app_name:' + client_app_name;
        }
        const promise = MonitorActions.getMonitorDatas('count', keyword, 'request', query, uniqueKey, timeoutCondition, errorCondition);
        promise.catch(() => {
            console.log('load data error');
        });
    },

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    },

    render() {
        let monitorDatas = this.state.monitorDatas;
        let timeoutCondition = this.state.kongLogParams.timeout_condition
        let errorCondition = this.state.kongLogParams.error_condition
        let {keyword, logType, client_app_name} = this.props.location.query
        keyword = keyword || '1 day ago';
        let uniqueKey = logType + "_" + keyword.replace(/ /g, "_") + "_request_detail";
        let headerTitle = 'logType:' + logType
        if (client_app_name) {
            uniqueKey = logType + "_" + client_app_name + "_" + keyword.replace(/ /g, "_") + "_request_detail";
            headerTitle = headerTitle + ', 应用:' + client_app_name + ', 时间段:' + keyword;
        }
        headerTitle = '服务请求情况(' + headerTitle + ')';
        if (!monitorDatas[uniqueKey]) {
            return <Spinner/>;
        }
        let datas = [];
        Object.keys(monitorDatas[uniqueKey][0].terms).forEach((request) => {
            datas.push({
                request: request,
                allCount: monitorDatas[uniqueKey][0].terms[request],
                timeoutCount: monitorDatas[uniqueKey][1].terms[request] || 0,
                failCount: monitorDatas[uniqueKey][2].terms[request] || 0
            });
        })
        // datas = datas.filter(function (data) {
        //     return data.timeoutCount > 0 || data.failCount > 0
        // })
        datas = datas.sort((data1, data2) => {
            return (data1.timeoutCount + data1.failCount) / data1.allCount < (data2.timeoutCount + data2.failCount) / data2.allCount ? 1 : -1;
        })
        return (
            <Row className="content" style={{padding: '10px'}}>
                <div style={{width: '100%'}}>
                    <div style={{
                        marginTop: '-5px',
                        marginBottom: '5px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <span style={{fontSize: 14, fontWeight: 'bold'}}>{headerTitle}</span>
                    </div>
                    <Table striped bordered hover size="sm">
                        <thead>
                        <tr>
                            <th style={{textAlign: 'center', width: '5%'}}>#</th>
                            <th style={{textAlign: 'center', width: '45%'}}>请求路径</th>
                            <th style={{textAlign: 'center', width: '10%'}}>总访问量</th>
                            <th style={{textAlign: 'center', width: '10%'}}>超时总访问量({timeoutCondition})</th>
                            <th style={{textAlign: 'center', width: '10%'}}>超时率</th>
                            <th style={{textAlign: 'center', width: '10%'}}>错误总访问量({errorCondition})</th>
                            <th style={{textAlign: 'center', width: '10%'}}>错误率</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            datas.map((data, index) => {
                                let allCount = (data.failCount + data.timeoutCount) > data.allCount ? (data.failCount + data.timeoutCount) : data.allCount
                                return (
                                    <tr key={'row' + index}>
                                        <td style={{textAlign: 'center', width: '5%'}}>{index + 1}</td>
                                        <td style={{width: '45%', wordBreak: 'break-all'}}>{data.request}</td>
                                        <td style={{textAlign: 'center', width: '10%'}}>{allCount}</td>
                                        <td style={{textAlign: 'center', width: '10%'}}>{data.timeoutCount}</td>
                                        <td style={{
                                            textAlign: 'center',
                                            width: '10%'
                                        }}>{((data.timeoutCount / allCount) * 100).toFixed(2) + '%'}</td>
                                        <td style={{textAlign: 'center', width: '10%'}}>{data.failCount}</td>
                                        <td style={{
                                            textAlign: 'center',
                                            width: '10%'
                                        }}>{((data.failCount / allCount) * 100).toFixed(2) + '%'}</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </Row>
        )
    }
});

export default MonitorRequestDetail;