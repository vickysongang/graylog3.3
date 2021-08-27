import React from 'react';
import createReactClass from 'create-react-class';
import MonitorRateBarChart from '../components/MonitorRateBarChart'
import TopNDataTable from '../components/TopNDataTable'
import {Row} from 'components/graylog';

const MonitorCenter = createReactClass({

    getInitialState() {
        return {
            env: 'PROD'
        }
    },

    render() {
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
                    <div>
                        <div style={styles.containerItem}>
                            <MonitorRateBarChart key={"KONG-LOG-24-RATE"}
                                                 text="24h内Kong请求"
                                                 keyword="1 day ago"
                                                 subtext="应用异常请求占比（耗时>10s或者响应code>=500）"
                                                 width="100%"
                                                 logType="kong-log"/>
                            <MonitorRateBarChart key={"KONG-LOG-48-RATE"}
                                                 text="48h-24h内Kong请求"
                                                 keyword="2 days ago to 1 day ago"
                                                 subtext="应用异常请求占比（耗时>10s或者响应code>=500）"
                                                 width="100%"
                                                 logType="kong-log"/>
                        </div>
                        <div style={{...styles.containerItem, marginTop: '25px'}}>
                            <TopNDataTable key={"KONG-LOG-24-Top10"}
                                           logType="kong-log"
                                           keyword="1 day ago"
                                           N={10}
                                           headerTitle="Kong 24h内异常请求访问Top10"/>
                            <TopNDataTable key={"KONG-LOG-48-TOP10"}
                                           logType="kong-log"
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