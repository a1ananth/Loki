import React from 'react';
import PropTypes from 'prop-types';

class ResultTypeHelperText extends React.Component {
  render() {
    const { resultType } = this.props;
    let helperText;

    switch (resultType) {
      case 'redirect': {
        helperText = (
          <p className="m-0">
            This will redirect you to the specified URL.
          </p>
        );

        break;
      }

      case 'fixed_text': {
        helperText = (
          <p className="m-0">
            This will show fixed text as the result.
          </p>
        );

        break;
      }

      case 'meta_search': {
        helperText = (
          <p className="m-0">
            This will display aggregated results (if available) from other search engines.
          </p>
        );

        break;
      }

      case '':
      case 'none': {
        helperText = (
          <p className="m-0">
            This will always redirect your search query to your default search engine.
          </p>
        );
        break;
      }

      default: {
        helperText = (
          <p className="m-0">
            No documentation found for this result type.
          </p>
        );
      }
    }

    return (
      <div className="helper-text">
        {helperText}
      </div>
    )
  }
}

ResultTypeHelperText.defaultProps = {
  resultType: '',
};

ResultTypeHelperText.propTypes = {
  resultType: PropTypes.string,
};

export default ResultTypeHelperText;
