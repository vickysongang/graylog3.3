import React from 'react';
import createReactClass from 'create-react-class';
import MonitorRateBarChart from '../components/MonitorRateBarChart'
import TopNDataTable from '../components/TopNDataTable'
import {Row} from 'components/graylog';
import Reflux from 'reflux';
import {MonitorActions, MonitorStore} from 'stores/MonitorStore';
import {Button, ButtonToolbar} from 'react-bootstrap';

const MonitorCenter = createReactClass({
    mixins: [Reflux.connect(MonitorStore)],

    getInitialState() {

        return {
            currentLogType: undefined,
            date: undefined
        }
    },

    componentWillMount() {
        MonitorActions.getKongLogParams()
    },

    handleClick(logType) {
        this.setState({
            currentLogType: logType,
            date: new Date()
        })
    },

    render() {
        let kongLogTypeArray = ['kong-log']
        let kongLogParams = this.state.kongLogParams
        console.log('kongLogParams is:', kongLogParams)
        let kongLogTypes = this.state.kongLogParams.kong_log_types
        if (kongLogTypes) {
            kongLogTypeArray = kongLogTypes.split(',')
        }
        let timeoutCondition = this.state.kongLogParams.timeout_condition
        let errorCondition = this.state.kongLogParams.error_condition
        let currentLogType = this.state.currentLogType || kongLogTypeArray[0]
        let date = this.state.date
        let key = currentLogType + (date ? (date + '').replace(/ /g, '-') : '')
        console.log('currentLogType:', currentLogType + ' key is:' + key +
            ' timeoutCondition is:' + timeoutCondition + ' errorCondition is:' + errorCondition)
        return (
            <Row className="content" style={{padding: '10px'}}>
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
                    <div style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <span style={{fontSize: 14, fontWeight: 'bold'}}>日志类型切换：</span>
                        <ButtonToolbar>
                            {
                                kongLogTypeArray.map(item => {
                                    return <Button key={item} bsStyle={item === currentLogType ? 'primary' : 'default'}
                                                   bsSize="xsmall" onClick={() => {
                                        this.handleClick(item)
                                    }}>
                                        {item}
                                    </Button>
                                })
                            }
                        </ButtonToolbar>
                    </div>
                    <div>
                        <div style={styles.containerItem}>
                            <MonitorRateBarChart key={"KONG-LOG-24-RATE" + key}
                                                 text="24h内Kong请求"
                                                 keyword="1 day ago"
                                                 timeoutCondition={timeoutCondition}
                                                 errorCondition={errorCondition}
                                                 subtext={"应用异常请求占比（" + timeoutCondition + "或" + errorCondition + "）"}
                                                 width="100%"
                                                 logType={currentLogType}/>
                            <MonitorRateBarChart key={"KONG-LOG-48-RATE" + key}
                                                 text="48h-24h内Kong请求"
                                                 timeoutCondition={timeoutCondition}
                                                 errorCondition={errorCondition}
                                                 keyword="2 days ago to 1 day ago"
                                                 subtext={"应用异常请求占比（" + timeoutCondition + "或" + errorCondition + "）"}
                                                 width="100%"
                                                 logType={currentLogType}/>
                        </div>
                        <div style={{...styles.containerItem, marginTop: '25px'}}>
                            <TopNDataTable key={"KONG-LOG-24-Top10" + key}
                                           logType={currentLogType}
                                           keyword="1 day ago"
                                           timeoutCondition={timeoutCondition}
                                           errorCondition={errorCondition}
                                           N={10}
                                           headerTitle="Kong 24h内异常请求访问Top10"/>
                            <TopNDataTable key={"KONG-LOG-48-TOP10" + key}
                                           logType={currentLogType}
                                           timeoutCondition={timeoutCondition}
                                           errorCondition={errorCondition}
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