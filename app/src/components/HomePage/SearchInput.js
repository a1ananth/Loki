import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import * as suggestActions from '../../actions/suggestActions';

class SearchInput extends React.Component {
  static getLabelKey(option) {
    if (!option) {
      return 'no-label';
    }

    return option;
  }

  constructor(props) {
    super(props);

    this.state = {
      searchQuery: props.defaultQuery ? props.defaultQuery : '',
      isLoading: false,
      options: [],
    };

    this.cache = {};
    this.typeahead = null;

    this.filterSuggestions = this.filterSuggestions.bind(this);
    this.getSearchSuggestions = this.getSearchSuggestions.bind(this);
    this.searchTextChanged = this.searchTextChanged.bind(this);
    this.renderSearchSuggestion = this.renderSearchSuggestion.bind(this);
    this.setTypeahead = this.setTypeahead.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    const suggestionData = this.props.suggest[this.state.searchQuery];

    if (!suggestionData || !suggestionData.loaded) {
      this.setState({
        isLoading: true,
      });

      this.getSearchSuggestions(this.state.searchQuery);
    } else {
      const options = suggestionData.suggestions;

      this.setState({
        isLoading: false,
        options,
      });
    }
  }

  setTypeahead(typeahead) {
    this.typeahead = typeahead;
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultQuery !== this.props.defaultQuery) {
      this.setState({
        searchQuery: nextProps.defaultQuery,
      });
    }

    if (nextProps.suggest !== this.props.suggest) {
      const { searchQuery } = this.state;
      if (nextProps.suggest[searchQuery] && nextProps.suggest[searchQuery].loaded) {
        const suggestionData = nextProps.suggest[searchQuery];
        const options = suggestionData.suggestions;

        if (options.length) {
          this.cache[searchQuery] = options;
        }

        this.setState({
          isLoading: false,
          options,
        });
      }
    }
  }

  componentWillUnmount() {
    this.cache = {};
    this.typeahead = null;
  }

  getSearchSuggestions(query) {
    if (this.cache[query]) {
      this.setState({
        isLoading: false,
        options: this.cache[query],
      });

      return;
    }

    this.setState({
      isLoading: true,
    });

    this.props.actions.getSearchSuggestionsStarting(query);
    this.props.actions.getSearchSuggestions(query);
  }

  filterSuggestions(/* option */) {
    return true;
  }

  searchTextChanged(query) {
    this.setState({
      searchQuery: query,
    });

    this.props.onSearchQueryChanged(query);

    if (!query) {
      this.getSearchSuggestions('');
    }
  }

  renderSearchSuggestion(option) {
    return (
      <div key={option}>
        {option}
      </div>
    );
  }

  onKeyDown(event) {
    if (event.keyCode === 13) {
      this.props.onSearchQueryChanged(this.state.searchQuery, true);
    }
  }

  render() {
    const { options, isLoading, searchQuery } = this.state;

    return (
      <AsyncTypeahead
        id="search-input"
        options={options}
        isLoading={isLoading}
        minLength={0}
        multiple={false}
        useCache={false}
        ref={this.setTypeahead}
        onInputChange={this.searchTextChanged}
        defaultInputValue={searchQuery}
        onSearch={this.getSearchSuggestions}
        filterBy={this.filterSuggestions}
        onChange={this.props.onSuggestionClicked}
        placeholder={'Search'}
        promptText={'Search'}
        labelKey={SearchInput.getLabelKey}
        renderMenuItemChildren={this.renderSearchSuggestion}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

SearchInput.defaultProps = {
  actions: {},
  defaultQuery: '',
  suggest: {},
};

SearchInput.propTypes = {
  actions: PropTypes.object,
  defaultQuery: PropTypes.string,
  suggest: PropTypes.object,
  onSearchQueryChanged: PropTypes.func.isRequired,
  onSuggestionClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state => ({
  suggest: state.suggest,
}));

const mapDispatchToProps = (dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, suggestActions),
    dispatch,
  ),
}));

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
