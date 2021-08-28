import React from 'react';
import createReactClass from 'create-react-class';
import MonitorRateBarChart from '../components/MonitorRateBarChart'
import TopNDataTable from '../components/TopNDataTable'
import {Row} from 'components/graylog';
import Reflux from 'reflux';
import {MonitorActions, MonitorStore} from 'stores/MonitorStore';
import { Button, ButtonToolbar  } from 'react-bootstrap';

const MonitorCenter = createReactClass({
    mixins: [Reflux.connect(MonitorStore)],

    getInitialState() {

        return {
            currentLogType: undefined
        }
    },

    componentWillMount() {
        MonitorActions.getKongLogTypes().then(() => {
            console.log(this.state.kongLogTypes)
        })
    },

    handleClick(logType) {
        this.setState({
            currentLogType: logType
        })
    },

    render() {
        let kongLogTypeArray = ['kong-log']
        if (this.state.kongLogTypes) {
            kongLogTypeArray = this.state.kongLogTypes.split(',')
        }
        let currentLogType = this.state.currentLogType || kongLogTypeArray[0]
        console.log('currentLogType:' , currentLogType)
        return (
            <Row className="content" style={{padding:'10px'}}>
                <div>
                    <div style={{
                        marginTop: '-5px',
                        marginBottom: '5px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <span style={{fontSize: 16, fontWeight: 'bold'}}>Kong请求监控</span>
                    </div>
                    <div style={{ marginTop: '5px', marginBottom: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 'bold' }}>日志类型切换：</span>
                        <ButtonToolbar>
                            {
                                kongLogTypeArray.map(item => {
                                   return <Button  key={item} bsStyle={item === currentLogType ? 'primary' : 'default'} bsSize="xsmall" onClick={() => {this.handleClick(item)}}>
                                       {item}
                                    </Button>
                                })
                            }
                        </ButtonToolbar>
                    </div>
                    <div>
                        <div style={styles.containerItem}>
                            <MonitorRateBarChart key={"KONG-LOG-24-RATE"}
                                                 text="24h内Kong请求"
                                                 keyword="1 day ago"
                                                 subtext="应用异常请求占比（耗时>10s或者响应code>=500）"
                                                 width="100%"
                                                 logType={currentLogType}/>
                            <MonitorRateBarChart key={"KONG-LOG-48-RATE"}
                                                 text="48h-24h内Kong请求"
                                                 keyword="2 days ago to 1 day ago"
                                                 subtext="应用异常请求占比（耗时>10s或者响应code>=500）"
                                                 width="100%"
                                                 logType={currentLogType}/>
                        </div>
                        <div style={{...styles.containerItem, marginTop: '25px'}}>
                            <TopNDataTable key={"KONG-LOG-24-Top10"}
                                           logType={currentLogType}
                                           keyword="1 day ago"
                                           N={10}
                                           headerTitle="Kong 24h内异常请求访问Top10"/>
                            <TopNDataTable key={"KONG-LOG-48-TOP10"}
                                           logType={currentLogType}
                                           N={10}
                                           keyword="2 days ago to 1 day ago"
                                           headerTitle="Kong 48h-24h内异常请求访问Top10"/>
                        </div>
                    </div>
                </div>
            </Row>
        );
    }
});

const styles = {
    containerItem: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    }
}

export default MonitorCenter;