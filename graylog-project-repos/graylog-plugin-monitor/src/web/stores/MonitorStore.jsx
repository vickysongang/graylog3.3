import Reflux from 'reflux';
import ApiRoutes from 'routing/ApiRoutes';
import URLUtils from 'util/URLUtils';

const moment = require('moment');
require('moment/locale/zh-cn')
moment.locale('zh-cn');
import fetch from 'logic/rest/FetchProvider';
import {PLUGIN_API_ENDPOINT} from "../Constants";

export const MonitorActions = Reflux.createActions({
    "getMonitorDatas": {asyncResult: true},
    "getKongLogParams": {asyncResult: true}
});

export const MonitorStore = Reflux.createStore({
    listenables: [MonitorActions],
    monitorDatas: {},
    kongLogParams: {},

    getInitialState() {
        return {
            monitorDatas: this.monitorDatas,
            kongLogParams: this.kongLogParams
        };
    },

    getKongLogParams() {
        const url = URLUtils.qualifyUrl(PLUGIN_API_ENDPOINT);
        console.log('url:' + url)
        let promise = fetch('GET', url);
        promise.then(result => {
            this.trigger({
                kongLogParams: result || {}
            });
        })
        MonitorActions.getKongLogParams.promise(promise);
    },

    getMonitorDatas(statType, keyword, field, query, uniqueKey, timeoutCondition, errorCondition, stackFields, sortOrder, streamId) {
        if (statType === 'count') {
            this.getMonitorCountDatas(keyword, field, query, uniqueKey, timeoutCondition, errorCondition, stackFields, sortOrder, streamId);
        } else if (statType === 'rate') {
            this.getMonitorRateDatas(keyword, field, query, uniqueKey, timeoutCondition, errorCondition, stackFields, sortOrder, streamId)
        }
    },

    getMonitorCountDatas(keyword, field, query, uniqueKey, timeoutCondition, errorCondition, stackFields, sortOrder, streamId) {
        console.log('getMonitorCountDatas keyword is:' + keyword + ' timeoutCondition is:'
            + timeoutCondition + ' errorCondition is:' + errorCondition)
        let rangeType = 'keyword';
        let timeRange = {keyword: keyword};
        sortOrder = sortOrder || 'desc';
        streamId = streamId || null;
        query = query || '*';
        let fetchAllUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, query, field, sortOrder, 1000, stackFields, timeRange, streamId).url;
        let promise1 = fetch('GET', URLUtils.qualifyUrl(fetchAllUrl));
        console.log('getMonitorCountDatas queryAll:', query)

        timeoutCondition = timeoutCondition || 'time-taken:\/[1-9][0-9]+.*\/ AND response:<500'
        let timeoutQuery = query + ' AND (' + timeoutCondition + ')';
        let fetchTimeoutUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, timeoutQuery, field, sortOrder, 1000, stackFields, timeRange, streamId).url;
        let promise2 = fetch('GET', URLUtils.qualifyUrl(fetchTimeoutUrl));
        console.log('getMonitorCountDatas timeoutQuery:', timeoutQuery)

        errorCondition = errorCondition || 'response:>=500'
        let errorQuery = query + ' AND (' + errorCondition + ')';
        let fetchErrorUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, errorQuery, field, sortOrder, 1000, stackFields, timeRange, streamId).url;
        let promise3 = fetch('GET', URLUtils.qualifyUrl(fetchErrorUrl));
        console.log('getMonitorCountDatas errorQuery:', errorQuery)

        let promise = Promise.all([promise1, promise2, promise3]).then((result) => {
            let monitorDatas = this.monitorDatas
            result.forEach(item => {
                let {terms, terms_mapping} = item

                Object.keys(terms).forEach(key => {
                    if (key.includes("?") || key.includes(".") || key.includes("%") || key == 'null') {
                        delete terms[key]
                    }
                })
                Object.keys(terms_mapping).forEach(key => {
                    if (key.includes("?") || key.includes(".") || key.includes("%") || key == 'null') {
                        delete terms_mapping[key]
                    }
                })
            })
            console.log('getMonitorCountDatas result is:', result);
            monitorDatas[uniqueKey] = result
            this.trigger({
                monitorDatas: monitorDatas,
            });
        }).catch((error) => {
            console.log('getMonitorCountDatas error is:', error);
        })
        MonitorActions.getMonitorDatas.promise(promise);
    },

    getMonitorRateDatas(keyword, field, query, uniqueKey, timeoutCondition, errorCondition, stackFields, sortOrder, streamId) {
        console.log('getMonitorRateDatas keyword is:' + keyword + ' timeoutCondition is:'
            + timeoutCondition + ' errorCondition is:' + errorCondition)
        let rangeType = 'keyword';
        let timeRange = {keyword: keyword};
        sortOrder = sortOrder || 'desc';
        streamId = streamId || null;
        query = query || '*';
        let fetchAllUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, query, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise1 = fetch('GET', URLUtils.qualifyUrl(fetchAllUrl));
        console.log('getMonitorRateDatas queryAll:', query)

        timeoutCondition = timeoutCondition || 'time-taken:\/[1-9][0-9]+.*\/ AND response:<500'
        errorCondition = errorCondition || 'response:>=500'
        let unnormalQuery = query + ' AND ((' + timeoutCondition + ') OR (' + errorCondition + '))';
        let fetchUnnormalUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, unnormalQuery, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise2 = fetch('GET', URLUtils.qualifyUrl(fetchUnnormalUrl));
        console.log('getMonitorRateDatas unnormalQuery:', unnormalQuery)

        let promise = Promise.all([promise1, promise2]).then((result) => {
            result.forEach(item => {
                let {terms, terms_mapping} = item

                Object.keys(terms).forEach(key => {
                    if (key.includes("?") || key.includes(".") || key.includes("%") || key == 'null') {
                        delete terms[key]
                    }
                })
                Object.keys(terms_mapping).forEach(key => {
                    if (key.includes("?") || key.includes(".") || key.includes("%") || key == 'null') {
                        delete terms_mapping[key]
                    }
                })
            })

            console.log('getMonitorRateDatas result is:', result);
            let monitorDatas = this.monitorDatas
            monitorDatas[uniqueKey] = result
            this.trigger({
                monitorDatas: monitorDatas,
            });
        }).catch((error) => {
            console.log('getMonitorRateDatas error is:', error);
        })
        MonitorActions.getMonitorDatas.promise(promise);
    }
});