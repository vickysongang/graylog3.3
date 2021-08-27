import Reflux from 'reflux';
import ApiRoutes from 'routing/ApiRoutes';
import URLUtils from 'util/URLUtils';

const moment = require('moment');
require('moment/locale/zh-cn')
moment.locale('zh-cn');
import fetch from 'logic/rest/FetchProvider';

export const MonitorActions = Reflux.createActions({
    "getMonitorDatas": {asyncResult: true}
});

export const MonitorStore = Reflux.createStore({
    listenables: [MonitorActions],
    monitorDatas: {},

    getInitialState() {
        return {
            monitorDatas: this.monitorDatas
        };
    },

    getMonitorDatas(statType, keyword, field, query, uniqueKey, stackFields, sortOrder, streamId) {
        if (statType === 'count') {
            this.getMonitorCountDatas(keyword, field, query, uniqueKey, stackFields, sortOrder, streamId);
        } else if (statType === 'rate') {
            this.getMonitorRateDatas(keyword, field, query, uniqueKey, stackFields, sortOrder, streamId)
        }
    },

    getMonitorCountDatas(keyword, field, query, uniqueKey, stackFields, sortOrder, streamId) {
        console.log('getMonitorCountDatas keyword is:' + keyword)
        let rangeType = 'keyword';
        let timeRange = {keyword: keyword};
        sortOrder = sortOrder || 'desc';
        streamId = streamId || null;
        query = query || '*';
        console.log('getMonitorCountDatas query is:' + query)
        let fetchAllUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, query, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise1 = fetch('GET', URLUtils.qualifyUrl(fetchAllUrl));

        let timeoutQuery = query + ' AND time-taken:\/[1-9][0-9]+.*\/ AND response:<500';
        let fetchTimeoutUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, timeoutQuery, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise2 = fetch('GET', URLUtils.qualifyUrl(fetchTimeoutUrl));

        let errorQuery = query + ' AND response:>=500';
        let fetchErrorUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, errorQuery, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise3 = fetch('GET', URLUtils.qualifyUrl(fetchErrorUrl));

        let promise = Promise.all([promise1, promise2, promise3]).then((result) => {
            console.log('getMonitorCountDatas query:', query)
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

    getMonitorRateDatas(keyword, field, query, uniqueKey, stackFields, sortOrder, streamId) {
        let rangeType = 'keyword';
        let timeRange = {keyword: keyword};
        sortOrder = sortOrder || 'desc';
        streamId = streamId || null;
        query = query || '*';
        let fetchAllUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, query, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise1 = fetch('GET', URLUtils.qualifyUrl(fetchAllUrl));

        let unnormalQuery = query + ' AND ((time-taken:\/[1-9][0-9]+.*\/ AND response:<500) OR response:>=500)';
        let fetchUnnormalUrl = ApiRoutes.UniversalSearchApiController.fieldTerms(rangeType, unnormalQuery, field, sortOrder, 100, stackFields, timeRange, streamId).url;
        let promise2 = fetch('GET', URLUtils.qualifyUrl(fetchUnnormalUrl));

        let promise = Promise.all([promise1, promise2]).then((result) => {
            console.log('getMonitorRateDatas unnormalQuery:', unnormalQuery)
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