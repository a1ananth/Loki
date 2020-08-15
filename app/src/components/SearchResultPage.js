import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import SearchForm from './Common/SearchForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import queryString from "query-string";
import Footer from './Common/Footer';
import SearchResultError from './SearchResultPage/SearchResultError';
import SearchResultLoading from './SearchResultPage/SearchResultLoading';
import SearchResult from './SearchResultPage/SearchResult';
import { setDocumentTitle } from '../utils/general';
import * as searchActions from '../actions/searchActions';

class SearchResultPage extends React.Component {
  constructor(props) {
    super(props);

    const parsed = queryString.parse(props.location.search);
    const { q: query } = parsed;

    this.state = {
      query,
    };
  }

  componentDidMount() {
    const { query } = this.state;
    this.getSearchQuery(query);
    setDocumentTitle(query);
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      const parsed = queryString.parse(nextProps.location.search);
      const { q: query } = parsed;
      this.setState({
        query,
      });

      setDocumentTitle(query);
      this.getSearchQuery(query);
    }
  }

  getSearchQuery(query) {
    const { searchResults } = this.props;
    if (searchResults[query] && searchResults[query].loaded) {
      // Already loaded
      return;
    }

    if (query && query.length) {
      this.props.actions.getSearchResultStarting(query);
      this.props.actions.getSearchResult(query);
    }
  }

  render() {
    const { query } = this.state;

    let content;
    const { searchResults } = this.props;
    const queryResults = searchResults[query];
    if (!queryResults || queryResults.loading) {
      content = (
        <SearchResultLoading />
      );
    } else if (!queryResults.loaded || !queryResults.result) {
      content = (
        <SearchResultError
          error={queryResults.error}
        />
      );
    } else {
      content = (
        <SearchResult
          query={query}
          resultData={queryResults}
        />
      );
    }

    return (
      <div className="search-result-page">
        <Container fluid>
          <div className="search-form-container">
            <SearchForm
              autoFocus={false}
              defaultQuery={query}
            />
          </div>

          <div className="mt-3 search-result-container">
            {content}
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}

SearchResultPage.defaultProps = {
  actions: {},
  searchResults: {},
};

SearchResultPage.propTypes = {
  actions: PropTypes.object,
  searchResults: PropTypes.object,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = (state => ({
  searchResults: state.searchResults,
}));

const mapDispatchToProps = (dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, searchActions),
    dispatch,
  ),
}));

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultPage);
