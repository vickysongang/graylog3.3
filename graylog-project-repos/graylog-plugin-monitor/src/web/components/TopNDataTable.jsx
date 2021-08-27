import React from 'react';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import {MonitorActions, MonitorStore} from 'stores/MonitorStore';
import {Spinner} from 'components/common';
import createReactClass from 'create-react-class';

const TopNDataTable = createReactClass({
    mixins: [Reflux.connect(MonitorStore)],

    propTypes: {
        headerTitle: PropTypes.string,
        logType: PropTypes.string,
        keyword: PropTypes.string,
        N: PropTypes.number
    },

    componentDidMount() {
        setTimeout(() => {
            this.loadDatas(); //等待5秒再加载数据
        }, 3000)
        this.timer = setInterval(() => {
            console.log("60s刷新数据...");
            this.loadDatas()
        }, 60000);
    },

    loadDatas() {
        let rateDatas = this.getRateDatas();
        let redAppNames = Object.keys(rateDatas).filter(key => rateDatas[key] > 0.05)
        console.log(redAppNames)
        let orQuery = ''
        redAppNames.forEach(item => {
            orQuery += 'client_app_name:' + item + ' OR '
        })
        if (orQuery) {
            orQuery = orQuery.substr(0, orQuery.lastIndexOf("OR"))
        }
        let {keyword, logType} = this.props
        keyword = keyword || '1 day ago';
        let uniqueKey = logType + "_" + keyword.replace(/ /g, "_") + "_request_topn_data";
        let query = 'type: ' + logType + ' AND NOT response:404'
        if (orQuery) {
            query = query + ' AND (' + orQuery + ')'
        }
        const promise = MonitorActions.getMonitorDatas('count', keyword, 'request', query, uniqueKey, 'client_app_name');
        promise.catch(() => {
            console.log('load data error');
        });
    },

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    },

    getRateDatas() {
        let monitorDatas = this.state.monitorDatas;
        let keyword = this.props.keyword || '1 day ago';
        let key = this.props.logType + "_" + keyword.replace(/ /g, "_") + "_request";
        let rateDatas = {};
        if (monitorDatas[key]) {
            Object.keys(monitorDatas[key][0].terms).forEach((appName) => {
                let allCount = monitorDatas[key][0].terms[appName] || 1;
                let unnormalCount = monitorDatas[key][1].terms[appName] || 0;
                rateDatas[appName] = unnormalCount / allCount;
            })
        }
        return rateDatas;
    },

    render() {
        let monitorDatas = this.state.monitorDatas;
        let {keyword, logType} = this.props
        keyword = keyword || '1 day ago';
        let uniqueKey = logType + "_" + keyword.replace(/ /g, "_") + "_request_topn_data";
        if (!monitorDatas[uniqueKey]) {
            return <Spinner/>;
        }
        let datas = [];
        Object.keys(monitorDatas[uniqueKey][0].terms).forEach((request) => {
            let allCount = monitorDatas[uniqueKey][0].terms[request];
            let timeoutCount = monitorDatas[uniqueKey][1].terms[request] || 0;
            let errorCount = monitorDatas[uniqueKey][2].terms[request] || 0;
            datas.push({
                request: request.split(' - ')[0],
                appName: request.split(' - ')[1],
                allCount: allCount,
                timeoutCount: timeoutCount,
                errorCount: errorCount,
                unnormalCount: (timeoutCount + errorCount)
            });
        })
        datas = datas.filter((data) => {
            return data.unnormalCount > 0
        }).sort((data1, data2) => {
            return data1.unnormalCount / (data1.allCount || 1) < data2.unnormalCount / (data2.allCount || 1) ? 1 : -1;
        }).slice(0, this.props.N || 10)
        let rateDatas = this.getRateDatas();
        return (
            <div style={{width: '48%'}}>
                <div style={{
                    marginTop: '-5px',
                    marginBottom: '5px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <span style={{fontSize: 14, fontWeight: 'bold'}}>{this.props.headerTitle}</span>
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th style={{textAlign: 'center', width: '50%'}}>请求</th>
                        <th style={{textAlign: 'center', width: '10%'}}>应用</th>
                        <th style={{textAlign: 'center', width: '10%'}}>总量</th>
                        <th style={{textAlign: 'center', width: '10%'}}>超时量</th>
                        <th style={{textAlign: 'center', width: '10%'}}>错误量</th>
                        <th style={{textAlign: 'center', width: '10%'}}>异常率</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        datas.map((data, index) => {
                            let isRed = rateDatas[data.appName] > 0.1;
                            let allCount = data.unnormalCount > data.allCount ? data.unnormalCount : data.allCount
                            return (
                                <tr key={'row' + index} style={{color: isRed ? 'red' : '#000'}}>
                                    <td style={{wordBreak: 'break-all', width: '50%'}}>{data.request}</td>
                                    <td style={{wordBreak: 'break-all', width: '10%'}}>{data.appName}</td>
                                    <td style={{textAlign: 'center', width: '10%'}}>{allCount}</td>
                                    <td style={{textAlign: 'center', width: '10%'}}>{data.timeoutCount}</td>
                                    <td style={{textAlign: 'center', width: '10%'}}>{data.errorCount}</td>
                                    <td style={{
                                        textAlign: 'center',
                                        width: '10%'
                                    }}>{((data.unnormalCount / allCount) * 100).toFixed(2) + '%'}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </div>
        )
    }
});

export default TopNDataTable;