import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchForm from './Common/SearchForm';
import * as searchActions from '../actions/searchActions';
import SearchResultLoading from './SearchResultPage/SearchResultLoading';
import SearchResultError from './SearchResultPage/SearchResultError';
import EditResultForm from './EditPage/EditResultForm';
import { setDocumentTitle } from '../utils/general';
import Footer from './Common/Footer';

const queryString = require('query-string');

class EditPage extends React.Component {
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
    if (query) {
      setDocumentTitle(`Edit - ${query}`);
    }

    this.getSearchQuery(query);
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      const parsed = queryString.parse(nextProps.location.search);
      const { q: query } = parsed;
      this.setState({
        query,
      });

      if (query) {
        setDocumentTitle(`Edit - ${query}`);
      }

      this.getSearchQuery(query);
    }
  }

  getSearchQuery(query) {
    const { searchResults } = this.props;
    if (searchResults[query] && searchResults[query].loaded) {
      // Already loaded
      return;
    }

    if (query) {
      this.props.actions.getSearchResultStarting(query);
      this.props.actions.getSearchResult(query);
    }
  }

  render() {
    const { query } = this.state;

    let content;
    const { searchResults, appConfig } = this.props;

    const queryResults = searchResults[query];

    if (!query) {
      content = null;
    } else if (appConfig.loading) {
      content = (
        <SearchResultLoading />
      );
    } else if (!appConfig.canEdit) {
      content = (
        <div>
          <p>You do not have permission to access this page.</p>
        </div>
      );
    } else if (!queryResults || queryResults.loading) {
      content = (
        <SearchResultLoading />
      );
    } else if (!queryResults.loaded || !queryResults.result) {
      content = (
        <SearchResultError />
      );
    } else {
      content = (
        <EditResultForm
          query={query}
          resultData={queryResults}
        />
      );
    }

    return (
      <div className="edit-page">
        <Container fluid>
          <div className="search-form-container">
            <SearchForm
              autoFocus={false}
              defaultQuery={query}
              isSearchPage={false}
              isEditPage={true}
            />
          </div>

          <div className="mt-3">
            {content}
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}

EditPage.defaultProps = {
  actions: {},
  appConfig: {},
  searchResults: {},
};

EditPage.propTypes = {
  actions: PropTypes.object,
  appConfig: PropTypes.object,
  searchResults: PropTypes.object,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = (state => ({
  searchResults: state.searchResults,
  appConfig: state.appConfig,
}));

const mapDispatchToProps = (dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, searchActions),
    dispatch,
  ),
}));

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
