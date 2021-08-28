import PropTypes from 'prop-types';
import React from 'react';
import CombinedProvider from 'injection/CombinedProvider';

import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';
import {Button} from 'components/graylog';
import {BootstrapModalForm, Input} from 'components/bootstrap';
import {IfPermitted} from 'components/common';
import ObjectUtils from 'util/ObjectUtils';
import {PLUGIN_API_ENDPOINT, PLUGIN_CONFIG_CLASS_NAME} from '../Constants';

const {ConfigurationsActions} = CombinedProvider.get('Configurations');

// eslint-disable-next-line camelcase
const _initialState = ({config, config: {secret_key, secret_key_salt, ...configWithoutSecretKey}}) => ({
    config: ObjectUtils.clone(config),
    update: configWithoutSecretKey,
});

class MonitorPluginConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = _initialState(props);
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(newProps) {
        this.setState(_initialState(newProps));
    }

    _updateConfigField = (field, value) => {
        this.setState(({update}) => ({update: {...update, [field]: value}}));
    };

    _onCheckboxClick = (field, ref) => {
        return () => {
            this._updateConfigField(field, this[ref].getChecked());
        };
    };

    _onFocusSecretKey = () => {
        this.setState(({update}) => ({update: {...update, secret_key: ''}}));
    };

    _onSelect = (field) => {
        return (selection) => {
            this._updateConfigField(field, selection);
        };
    };

    _onUpdate = (field) => {
        return (e) => {
            this._updateConfigField(field, e.target.value);
        };
    };

    _openModal = () => {
        this.awsConfigModal.open();
    };

    _closeModal = () => {
        this.awsConfigModal.close();
    };

    _resetConfig = () => {
        // Reset to initial state when the modal is closed without saving.
        this.setState(_initialState(this.props));
    };

    _postConfigUpdate = (update) => {
        const url = URLUtils.qualifyUrl(PLUGIN_API_ENDPOINT);
        console.log('PLUGIN_API_ENDPOINT:' + PLUGIN_API_ENDPOINT)
        console.log('url:' + url)
        return fetch('PUT', url, update);
    };

    _saveConfig = () => {
        const {update} = this.state;
        this._postConfigUpdate(update)
            .then(() => ConfigurationsActions.list(PLUGIN_CONFIG_CLASS_NAME))
            .then(() => this._closeModal());
    };

    render() {
        const {config, update} = this.state;
        return (
            <div>
                <h3>Monitor Plugin Configuration</h3>

                <p>
                    Base configuration for all plugins the Monitor module is providing. Note
                    that some parameters will be stored in MongoDB without encryption.
                    Graylog users with required permissions will be able to read them in
                    the configuration dialog on this page.
                </p>

                <dl className="deflist">
                    <dt>Kong Log Types:</dt>
                    <dd>
                        {config.kong_log_types
                            ? config.kong_log_types
                            : '[not set]'}
                    </dd>

                    <dt>Timeout Condition:</dt>
                    <dd>
                        {config.timeout_condition
                            ? config.timeout_condition
                            : '[not set]'}
                    </dd>

                    <dt>Error Condition:</dt>
                    <dd>
                        {config.error_condition
                            ? config.error_condition
                            : '[not set]'}
                    </dd>
                </dl>

                <IfPermitted permissions="clusterconfigentry:edit">
                    <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>
                        Configure
                    </Button>
                </IfPermitted>

                <BootstrapModalForm ref={(elem) => {
                    this.awsConfigModal = elem;
                }}
                                    title="Update Monitor Plugin Configuration"
                                    onSubmitForm={this._saveConfig}
                                    onModalClose={this._resetConfig}
                                    submitButtonText="Save">
                    <fieldset>
                        <Input id="kong-log-type"
                               type="text"
                               label="Kong Log Types"
                               help={(
                                   <span>
                       Kong日志类型，多个以逗号隔开
                     </span>
                               )}
                               name="kong_log_types"
                               value={update.kong_log_types}
                               onChange={this._onUpdate('kong_log_types')}/>
                        <Input id="timeout_condition"
                               type="text"
                               label="Timeout Condition"
                               help={(
                                   <span>
                         接口超时的判断条件
                     </span>
                               )}
                               name="timeout_condition"
                               value={update.timeout_condition}
                               onChange={this._onUpdate('timeout_condition')}/>
                        <Input id="error_condition"
                               type="text"
                               label="Error Condition"
                               help={(
                                   <span>
                         接口报错的判断条件
                     </span>
                               )}
                               name="error_condition"
                               value={update.error_condition}
                               onChange={this._onUpdate('error_condition')}/>
                    </fieldset>
                </BootstrapModalForm>
            </div>
        );
    }
}

MonitorPluginConfiguration.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    config: PropTypes.object,
};

MonitorPluginConfiguration.defaultProps = {
    config: {
        kong_log_types: 'kong-log',
        timeout_condition: '',
        error_condition: ''
    },
};

export default MonitorPluginConfiguration;
