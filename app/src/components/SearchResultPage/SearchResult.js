import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import MetaSearchResult from './MetaSearchResult';
import Redirect from '../Common/Redirect';
import FixedTextResult from './FixedTextResult';
import RedirectToDefaultSearchEngine from './RedirectToDefaultSearchEngine';


class SearchResult extends React.Component {
  render () {
    const { query, resultData } = this.props;
    const { resultType } = resultData.result;

    switch (resultType) {
      case 'meta_search': {
        return (
          <MetaSearchResult
            query={query}
            resultData={resultData}
          />
        );
      }

      case 'fixed_text': {
        return (
          <FixedTextResult
            query={query}
            resultData={resultData}
          />
        )
      }

      case 'redirect': {
        const url = resultData.result.targetUrl;
        if (url) {
          return (
            <Redirect to={url} />
          );
        } else {
          return (
            <div>
              No target url specified for redirect.
            </div>
          );
        }
      }

      case '':
      case 'none': {
        return (
          <RedirectToDefaultSearchEngine
            query={query}
          />
        );
      }

      default: {
        return (
          <Card style={{ minHeight: '10vh' }}>
            <CardBody className="d-flex flex-column justify-content-center">
              <p className="m-0">
                <i className="fa fa-exclamation-circle" />
                &nbsp;&nbsp;
                This result type does not have a corresponding view.
              </p>
            </CardBody>
          </Card>
        );
      }
    }
  }
}

SearchResult.defaultProps = {
  query: '',
};

SearchResult.propTypes = {
  query: PropTypes.string,
  resultData: PropTypes.object.isRequired,
};

export default SearchResult;
