import React from 'react';
import PropTypes from 'prop-types';

class Redirect extends React.Component {
  componentDidMount() {
    window.location.replace(this.props.to);
  }

  render() {
    return (
      <div>
        Redirecting to {this.props.to}
      </div>
    );
  }
}

Redirect.propTypes = {
  to: PropTypes.string.isRequired,
};

export default Redirect;
