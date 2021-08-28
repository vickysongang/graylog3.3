// eslint-disable-next-line no-unused-vars
import webpackEntry from 'webpack-entry';
import packageJson from '../../package.json';
import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import MonitorCenter from 'pages/MonitorCenter';
import MonitorRequestDetail from 'pages/MonitorRequestDetail';
import MonitorPluginConfiguration from 'components/MonitorPluginConfiguration';
import { PLUGIN_CONFIG_CLASS_NAME } from './Constants';

const manifest = new PluginManifest(packageJson, {
  routes: [
    { path: '/monitor/center', component: MonitorCenter },
    { path: '/monitor/request', component: MonitorRequestDetail}
  ],

  // Adding an element to the top navigation pointing to /sample named "Sample":

  navigation: [
    { path: '/monitor/center', description: 'Monitor' }
  ],

  systemConfigurations: [
    {
      component: MonitorPluginConfiguration,
      configType: PLUGIN_CONFIG_CLASS_NAME,
    },
  ],
  //
  // systemnavigation: [
  //   { path: '/monitor/center', description: 'Monitor' },
  // ],
});

PluginStore.register(manifest);