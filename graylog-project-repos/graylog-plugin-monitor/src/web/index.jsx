// eslint-disable-next-line no-unused-vars
import webpackEntry from 'webpack-entry';
import packageJson from '../../package.json';
import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';

import SamplePage from 'pages/SamplePage';

const manifest = new PluginManifest(packageJson, {
  routes: [
    { path: '/system/sample', component: SamplePage },
  ],

  // Adding an element to the top navigation pointing to /sample named "Sample":

  navigation: [
    { path: '/system/sample', description: 'Sample' },
  ],

  systemnavigation: [
    { path: '/system/sample', description: 'Sample1' },
  ],
});

PluginStore.register(manifest);