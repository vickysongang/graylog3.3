export const PLUGIN_PACKAGE = 'org.graylog.plugins.monitor';
export const PLUGIN_CONFIG_CLASS_NAME = `${PLUGIN_PACKAGE}.config.MonitorPluginConfiguration`;
//export const PLUGIN_API_ENDPOINT = `/plugins/${PLUGIN_PACKAGE}/config`;
export const PLUGIN_API_ENDPOINT = `/system/cluster_config/${PLUGIN_CONFIG_CLASS_NAME}`
