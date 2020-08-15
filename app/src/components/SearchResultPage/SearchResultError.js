import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';

class SearchResultError extends React.Component {
  render () {
    const { error } = this.props;

    let errorMsg;
    if (error) {
      errorMsg = `Server response: ${error}`;
    } else {
      errorMsg = 'More Info available soon.';
    }

    return (
      <Card style={{ minHeight: '10vh' }}>
        <CardBody className="d-flex flex-column justify-content-center">
          <p className="m-0">
            <i className="fa fa-times" />
            &nbsp;&nbsp;
            Failed to get result for this query. {errorMsg}
          </p>
        </CardBody>
      </Card>
    );
  }
}

SearchResultError.defaultProps = {
  error: '',
};

SearchResultError.propTypes  = {
  error: PropTypes.string,
};

export default SearchResultError;
