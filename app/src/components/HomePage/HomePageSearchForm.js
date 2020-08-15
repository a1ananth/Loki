import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import logoImg from '../../assets/logo1.png';
import { history } from '../../store/configureStore';
import { suppressEvent } from '../../utils/general';
import SearchInput from './SearchInput';
import { apiBaseUrl, defaultTagline, siteName } from '../../constants/appConfig';
import { connect } from 'react-redux';
import PrivacyStatus from "../Common/PrivacyStatus";

class HomePageSearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: props.defaultQuery ? props.defaultQuery : '',
    };

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
      this.onSearchSubmit(null);
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

  onSuggestionClicked(query) {
    history.push(`/search?q=${query}`);
  }

  render() {
    const { query } = this.state;
    const { appearance } = this.props.appConfig.data;

    let tagline;
    if (appearance && appearance.tagline) {
      tagline = appearance.tagline;
    } else {
      tagline = defaultTagline;
    }

    let appLogo;
    if (appearance && appearance.logo) {
      appLogo = `${apiBaseUrl}/static/logo.png`;
    } else {
      appLogo = logoImg;
    }

    let siteName2 = siteName;
    if (appearance && appearance.siteName) {
      siteName2 = appearance.siteName;
    }

    return (
      <Row className="search-form">
        <Col xs={12} className="d-md-block mb-3 text-center">
          <img src={appLogo} className="img-responsive search-logo" alt="Loki Logo" />
          <h3 className="app-title">{siteName2}</h3>
        </Col>

        <Col xs={12} className="d-flex justify-content-center mt-0 mb-3">
          <Form method="POST" onSubmit={this.onSearchSubmit}>
            <InputGroup className="mt-2">
              <SearchInput
                defaultQuery={query}
                onSearchQueryChanged={this.onSearchQueryChanged}
                onSuggestionClicked={this.onSuggestionClicked}
              />

              <InputGroupAddon addonType="append">
                <Button type="button" color="success" onClick={this.onSearchSubmit}>
                  <i className="fa fa-search" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>

        </Col>
        <Col xs="12">
          <div className=" text-center ">
            <PrivacyStatus />
          </div>
        </Col>

        <Col xs={12}>
          <div className="mt-3 text-center tagline-container">
            <p className="">
              {tagline}
            </p>
          </div>
        </Col>
      </Row>
    );
  }
}

HomePageSearchForm.defaultProps = {
  appConfig: {},
  autoFocus: false,
  defaultQuery: '',
};

HomePageSearchForm.propTypes = {
  appConfig: PropTypes.object,
  autoFocus: PropTypes.bool,
  defaultQuery: PropTypes.string,
};

const mapStateToProps = (state => ({
  appConfig: state.appConfig,
}));

export default connect(mapStateToProps)(HomePageSearchForm);
