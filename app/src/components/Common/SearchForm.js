import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import logoImg from '../../assets/logo1.png';
import { history } from '../../store/configureStore';
import { suppressEvent } from '../../utils/general';
import { Link } from 'react-router-dom';
import SearchInput from '../HomePage/SearchInput';
import { apiBaseUrl, siteName } from '../../constants/appConfig';
import { connect } from 'react-redux';
import PrivacyStatus from "./PrivacyStatus";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: props.defaultQuery ? props.defaultQuery : '',
    };

    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSuggestionClicked = this.onSuggestionClicked.bind(this);
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    if (autoFocus) {
      const input = document.querySelector('.search-form .search-input');
      if (input) {
        input.focus();
      }
    }
  }

  /* eslint-disable-next-line react/no-deprecated */
  componentWillReceiveProps(nextProps) {
    if (this.props.defaultQuery !== nextProps.defaultQuery && this.state.query !== nextProps.defaultQuery) {
      this.setState({
        query: nextProps.defaultQuery,
      });
    }
  }

  onSearchQueryChanged(query, submitForm = false) {
    this.setState({
      query,
    });

    if (submitForm) {
      this.onSuggestionClicked(query);
    }
  }

  onSearchSubmit(event) {
    suppressEvent(event);

    const { query } = this.state;
    if (!query) {
      return false;
    }

    history.push(`/search?q=${query}`);
    return false;
  }

  onEditSubmit(event) {
    suppressEvent(event);

    const { query } = this.state;
    if (!query) {
      return false;
    }

    history.push(`/edit?q=${query}`);
    return false;
  }

  onSuggestionClicked(query) {
    const { isEditPage, isSearchPage } = this.props;

    if (isEditPage) {
      history.push(`/edit?q=${query}`);
    } else if (isSearchPage) {
      history.push(`/search?q=${query}`);
    }
  }

  render() {
    const { query } = this.state;
    const { appConfig, isSearchPage, isEditPage, showLogo } = this.props;

    let logoCol = null;
    if (showLogo) {
      const { appearance } = this.props.appConfig.data;

      let appLogo;
      if (appearance && appearance.logo) {
        appLogo = `${apiBaseUrl}/static/logo.png`;
      } else {
        appLogo = logoImg;
      }

      logoCol = (
        <Col xs="auto" className="">
          <Link to="/" title={`${siteName}`}>
            <img src={appLogo} className="img-responsive search-logo" alt={`${siteName} Logo`} />
          </Link>
        </Col>
      );
    }

    const canEdit = appConfig.loaded && appConfig.canEdit;

    return (
      <Row className="search-form">
        {logoCol}

        <Col xs={8} sm={8} md={8} lg={6} xl={4}>
          <Form method="POST" onSubmit={this.onSearchSubmit}>
            <InputGroup className="mt-2">
              <SearchInput
                defaultQuery={query}
                onSearchQueryChanged={this.onSearchQueryChanged}
                onSuggestionClicked={this.onSuggestionClicked}
              />

              {isSearchPage && (
                <InputGroupAddon addonType="append">
                  <Button type="submit" color="success" onClick={this.onSearchSubmit} title="Search">
                    <i className="fa fa-search" />
                    <span className="d-none d-md-inline">
                      &nbsp;&nbsp;
                      Search
                    </span>
                  </Button>
                </InputGroupAddon>
              )}

              {canEdit && isSearchPage && (
                <InputGroupAddon addonType="append" className="d-none d-md-inline">
                  <Button type="button" color="info" onClick={this.onEditSubmit} title="Edit">
                    <i className="fa fa-edit" />
                  </Button>
                </InputGroupAddon>
              )}

              {isEditPage && (
                <InputGroupAddon addonType="append">
                  <Button type="submit" color="info" onClick={this.onEditSubmit} title="Edit">
                    <i className="fa fa-edit" />
                    &nbsp;&nbsp;
                    Edit
                  </Button>
                </InputGroupAddon>
              )}

              {isEditPage && (
                <InputGroupAddon addonType="append">
                  <Button type="button" color="success" onClick={this.onSearchSubmit} title="Search">
                    <i className="fa fa-search" />
                  </Button>
                </InputGroupAddon>
              )}
            </InputGroup>
          </Form>
        </Col>

        {isSearchPage && (
          <Col xs={8} sm={8} md={8} lg={6} xl={4} className="d-flex flex-column justify-content-center">
            <PrivacyStatus />
          </Col>
        )}
      </Row>
    );
  }
}

SearchForm.defaultProps = {
  appConfig: {},
  autoFocus: false,
  defaultQuery: '',
  isSearchPage: true,
  isEditPage: false,
  showLogo: true,
};

SearchForm.propTypes = {
  appConfig: PropTypes.object,
  autoFocus: PropTypes.bool,
  defaultQuery: PropTypes.string,
  isSearchPage: PropTypes.bool,
  isEditPage: PropTypes.bool,
  showLogo: PropTypes.bool,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(SearchForm);
