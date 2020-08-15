import React from 'react';
import { Card, CardBody } from 'reactstrap';

class SearchResultLoading extends React.Component {
  render () {
    return (
      <Card style={{ minHeight: '10vh' }}>
        <CardBody className="d-flex flex-column justify-content-center">
          <p className="m-0">
            <i className="fa fa-spinner fa-spin" />
            &nbsp;&nbsp;
            Loading...
          </p>
        </CardBody>
      </Card>
    );
  }
}

export default SearchResultLoading;
