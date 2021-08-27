// eslint-disable-next-line no-unused-vars
import webpackEntry from 'webpack-entry';
import packageJson from '../../package.json';
import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import MonitorCenter from 'pages/MonitorCenter';
import MonitorRequestDetail from 'pages/MonitorRequestDetail';

const manifest = new PluginManifest(packageJson, {
  routes: [
    { path: '/monitor/center', component: MonitorCenter },
    { path: '/monitor/request', component: MonitorRequestDetail}
  ],

  // Adding an element to the top navigation pointing to /sample named "Sample":

  navigation: [
    { path: '/monitor/center', description: 'Monitor' }
  ],
  //
  // systemnavigation: [
  //   { path: '/monitor/center', description: 'Monitor' },
  // ],
});

PluginStore.register(manifest);