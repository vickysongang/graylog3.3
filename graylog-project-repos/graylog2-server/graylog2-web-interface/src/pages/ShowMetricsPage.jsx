import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';

import ActionsProvider from 'injection/ActionsProvider';

import { DocumentTitle, PageHeader, Spinner } from 'components/common';
import { MetricsComponent } from 'components/metrics';

const NodesStore = StoreProvider.getStore('Nodes');
const MetricsStore = StoreProvider.getStore('Metrics');
const MetricsActions = ActionsProvider.getActions('Metrics');

const ShowMetricsPage = createReactClass({
  displayName: 'ShowMetricsPage',

  propTypes: {
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },

  mixins: [Reflux.connect(NodesStore), Reflux.connect(MetricsStore), Reflux.listenTo(NodesStore, '_getMetrics')],

  _getMetrics() {
    MetricsActions.names();
  },

  render() {
    if (!this.state.nodes || !this.state.metricsNames) {
      return <Spinner />;
    }

    let { nodeId } = this.props.params;
    // "master" node ID is a placeholder for master node, get first master node ID
    if (nodeId === 'master') {
      const nodeIDs = Object.keys(this.state.nodes);
      const masterNodes = nodeIDs.filter((nodeID) => this.state.nodes[nodeID].is_master);
      nodeId = masterNodes[0] || nodeIDs[0];
    }

    const { metricsNames, metricsErrors } = this.state;

    const node = this.state.nodes[nodeId];
    const title = <span>Metrics of node {node.short_node_id} / {node.hostname}</span>;
    const { namespace } = MetricsStore;
    const names = metricsNames[nodeId];
    const error = metricsErrors ? metricsErrors[nodeId] : undefined;
    const { filter } = this.props.location.query;
    return (
      <DocumentTitle title={`Metrics of node ${node.short_node_id} / ${node.hostname}`}>
        <span>
          <PageHeader title={title}>
            <span>
              All Graylog nodes provide a set of internal metrics for diagnosis, debugging and monitoring. Note that you can access
              all metrics via JMX, too.
            </span>
            <span>This node is reporting a total of {(names || []).length} metrics.</span>
          </PageHeader>

          <MetricsComponent names={names} namespace={namespace} nodeId={nodeId} filter={filter} error={error} />
        </span>
      </DocumentTitle>
    );
  },
});

export default ShowMetricsPage;
