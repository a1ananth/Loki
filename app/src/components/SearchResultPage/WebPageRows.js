import React from 'react';
import PropTypes from 'prop-types';
import WebPageRow from './WebPageRow';
// import * as actionsActions from '../actions/actions';

class WebPageRows extends React.Component {
  constructor(props) {
    super(props);
  }

  getWebPageRows(webPageIds, webPageData) {
    const rows = [];
    webPageIds.forEach((webPageId) => {
      const data = webPageData[webPageId];
      if (!data) {
        return true;
      }

      rows.push((
        <WebPageRow
          key={webPageId}
          webPageId={webPageId}
          webPageData={data}
        />
      ));
    });

    return rows;
  }

  render() {
    const { source, resultData } = this.props;

    let webPageIds;

    if (source === 'd') {
      webPageIds = resultData.result.ddgResults;
    } else if (source === 'g') {
      webPageIds = resultData.result.googleResults;
    } else {
      webPageIds = [];
    }

    if (!webPageIds.length) {
      return (
        <div className="text-center p-4">
          No results.
        </div>
      );
    }

    const webPageRows = this.getWebPageRows(webPageIds, resultData.webPages);

    return (
      <div>
        {webPageRows}
      </div>
    );
  }
}

WebPageRows.defaultProps = {
  query: '',
};

WebPageRows.propTypes = {
  query: PropTypes.string,
  resultData: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
};

export default WebPageRows;
