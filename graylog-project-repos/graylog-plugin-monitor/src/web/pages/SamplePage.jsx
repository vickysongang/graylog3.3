import React from 'react';

import { Row, Col } from 'react-bootstrap';

import { PageHeader } from 'components/common';

class SamplePage extends React.Component{
  render() {
    return (
      <PageHeader title="Sample Plugin">
        <span>
          Hello from the Sample plugin!
        </span>
      </PageHeader>
    );
  }
};

export default SamplePage;
